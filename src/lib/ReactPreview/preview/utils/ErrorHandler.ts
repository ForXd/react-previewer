// utils/ErrorHandler.ts
import type { ErrorInfo } from '../types';
import { createModuleLogger } from './Logger';
import { originalPositionFor, TraceMap } from '@jridgewell/trace-mapping';
import {
  isPreviewDependencyError,
  type DependencyErrorPayload
} from '../errors';

const logger = createModuleLogger('ErrorHandler');

interface SourceLocation {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

const SOURCE_FILE_PATTERN = '[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*\\.(?:[cm]?[jt]sx?|css)';

function normalizeFileName(fileName?: string): string | undefined {
  if (!fileName) return undefined;
  return fileName
    .trim()
    .replace(/^ERROR in\s+/i, '')
    .replace(/^\.\//, '')
    .replace(/^\//, '');
}

function parseSourceLocation(message?: string, hintedFileName?: string): SourceLocation {
  if (!message) {
    return { fileName: normalizeFileName(hintedFileName) };
  }

  const directLocation = message.match(new RegExp(
    `(?:^|\\n|[\\s(])(?:ERROR in\\s+)?(?:\\./|/)?(${SOURCE_FILE_PATTERN})(?::|\\s+)(\\d+):(\\d+)`,
    'i'
  ));
  if (directLocation) {
    return {
      fileName: normalizeFileName(directLocation[1]),
      lineNumber: Number(directLocation[2]),
      columnNumber: Number(directLocation[3])
    };
  }

  const parenthesizedLocation = message.match(/\((\d+):(\d+)\)/);
  const fileMatches = Array.from(message.matchAll(new RegExp(
    `(?:^|[\\s(])(?:\\./|/)?(${SOURCE_FILE_PATTERN})(?=[:\\s])`,
    'gi'
  )));
  const parsedFileName = fileMatches[fileMatches.length - 1]?.[1];
  if (parenthesizedLocation) {
    return {
      fileName: normalizeFileName(hintedFileName ?? parsedFileName),
      lineNumber: Number(parenthesizedLocation[1]),
      columnNumber: Number(parenthesizedLocation[2])
    };
  }

  return { fileName: normalizeFileName(hintedFileName ?? parsedFileName) };
}

function extractCodeFrame(message?: string): { message?: string; codeFrame?: string } {
  if (!message) return { message };

  const lines = message.split('\n');
  const frameStart = lines.findIndex((line) => /^\s*>?\s*\d+\s*\|/.test(line));
  if (frameStart < 0) return { message };

  return {
    message: lines.slice(0, frameStart).join('\n').trim(),
    codeFrame: lines.slice(frameStart).join('\n').trimEnd()
  };
}

function parseStackLocation(stack?: string, fileName?: string): SourceLocation {
  if (!stack) return { fileName };

  const escapedFileName = fileName?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = escapedFileName
    ? stack.match(new RegExp(`${escapedFileName}:(\\d+):(\\d+)`))
    : stack.match(/(?:at\s+.*?\()?([^\s()]+\.[cm]?[jt]sx?):(\d+):(\d+)/);

  if (!match) return { fileName };
  const hasKnownFileName = Boolean(escapedFileName);
  return {
    fileName: fileName ?? normalizeFileName(match[1]),
    lineNumber: Number(match[hasKnownFileName ? 1 : 2]),
    columnNumber: Number(match[hasKnownFileName ? 2 : 3])
  };
}

function normalizeSourceMapFileName(source: string): string {
  let fileName = source
    .replace(/^webpack:\/\/\/?/i, '')
    .replace(/^file:\/\//i, '')
    .replace(/^\.\//, '');
  const sourceDirectoryIndex = fileName.lastIndexOf('/src/');
  if (sourceDirectoryIndex >= 0) {
    fileName = fileName.slice(sourceDirectoryIndex + 5);
  }
  return fileName.replace(/^src\//, '').replace(/^\//, '');
}

function parseDependencyName(message?: string): string | undefined {
  if (!message) return undefined;
  return message.match(
    /(?:can't resolve|cannot find module|failed to resolve(?: module specifier)?|unable to resolve dependency)\s+["']([^"']+)["']/i
  )?.[1];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ErrorHandler {
  private blobToFileMap: Map<string, string> = new Map();
  private sourceMaps: Map<string, TraceMap> = new Map();

  setBlobToFileMap(
    blobUrls: Map<string, string>,
    sourceMaps: Map<string, string> = new Map()
  ): void {
    this.blobToFileMap.clear();
    this.sourceMaps.clear();
    blobUrls.forEach((blobUrl, fileName) => {
      logger.debug('setBlobToFileMap:', blobUrl, fileName);
      this.blobToFileMap.set(blobUrl, fileName);
    });
    sourceMaps.forEach((sourceMap, blobUrl) => {
      try {
        this.sourceMaps.set(blobUrl, new TraceMap(sourceMap));
      } catch (error) {
        logger.warn('Invalid preview source map:', blobUrl, error);
      }
    });
  }

  processRuntimeError(errorData: {
    filename?: string;
    stack?: string;
    message?: string;
    lineno?: number;
    colno?: number;
  }): ErrorInfo {
    const stackLocation = this.resolveStackLocation(errorData.stack);
    const eventLocation = this.resolveGeneratedLocation(
      errorData.filename,
      errorData.lineno,
      errorData.colno
    );
    const processedStack = this.processStackTrace(errorData.stack);
    const fallbackStackLocation = parseStackLocation(
      processedStack,
      stackLocation.fileName ?? eventLocation.fileName
    );
    const location = stackLocation.fileName ? stackLocation
      : eventLocation.fileName ? eventLocation
        : fallbackStackLocation;

    return {
      type: 'runtime',
      message: errorData.message || 'Runtime error occurred',
      stack: processedStack,
      fileName: location.fileName,
      lineNumber: location.lineNumber,
      columnNumber: location.columnNumber,
    };
  }

  processDependencyError(errorData: DependencyErrorPayload): ErrorInfo {
    const dependencyName = errorData.name;
    const detail = errorData.error;

    return {
      type: 'dependency',
      message: `Failed to load dependency "${dependencyName}": ${detail}`,
      dependencyName,
      dependencyUrl: errorData.url
    };
  }

  processCompileError(error: {
    type?: string;
    filename?: string;
    fileName?: string;
    loc?: { line?: number; column?: number };
    codeFrame?: string;
    message?: string;
    stack?: string;
    dependencyName?: string;
    dependencyUrl?: string;
    lineNumber?: number;
    columnNumber?: number;
  }): ErrorInfo {

    logger.debug("processCompileError: =======", error);
    if (isPreviewDependencyError(error)) {
      return {
        type: 'dependency',
        message: error.message,
        stack: error.stack,
        fileName: error.fileName,
        lineNumber: error.lineNumber,
        columnNumber: error.columnNumber,
        dependencyName: error.dependencyName,
        dependencyUrl: error.dependencyUrl
      };
    }

    // 尝试解析 Babel 错误对象的详细信息
    let fileName = error.filename || error.fileName;
    // blob 映射回真实文件名
    if (fileName && fileName.startsWith('blob:')) {
      const mapped = this.blobToFileMap.get(fileName);
      if (mapped) fileName = mapped;
    }
    const parsedLocation = parseSourceLocation(error.message, fileName);
    fileName = parsedLocation.fileName ?? fileName;
    const lineNumber = error.loc?.line ?? parsedLocation.lineNumber;
    const rawColumnNumber = error.loc?.column ?? parsedLocation.columnNumber;
    const columnNumber = rawColumnNumber === undefined ? undefined : rawColumnNumber + 1;
    const extractedFrame = extractCodeFrame(error.message);
    const codeFrame = error.codeFrame ?? extractedFrame.codeFrame;
    let message = extractedFrame.message;
    // 有些 message 里会重复 codeFrame，去掉
    if (codeFrame && message && message.includes(codeFrame)) {
      message = message.replace(codeFrame, '').trim();
    }
    const dependencyName = parseDependencyName(message);
    return {
      type: dependencyName ? 'dependency' : 'compile',
      message: message || 'Compile error occurred',
      stack: error.stack,
      fileName,
      lineNumber,
      columnNumber,
      codeFrame,
      dependencyName,
    };
  }

  private resolveStackLocation(stack?: string): SourceLocation {
    if (!stack) return {};

    for (const blobUrl of this.blobToFileMap.keys()) {
      const match = stack.match(new RegExp(`${escapeRegExp(blobUrl)}:(\\d+):(\\d+)`));
      if (!match) continue;
      return this.resolveGeneratedLocation(blobUrl, Number(match[1]), Number(match[2]));
    }

    return {};
  }

  private resolveGeneratedLocation(
    generatedFile?: string,
    lineNumber?: number,
    columnNumber?: number
  ): SourceLocation {
    if (!generatedFile) return {};

    const sourceMap = this.sourceMaps.get(generatedFile);
    if (sourceMap) {
      if (lineNumber === undefined || columnNumber === undefined) return {};
      const original = originalPositionFor(sourceMap, {
        line: lineNumber,
        column: Math.max(0, columnNumber - 1)
      });
      if (original.source === null || original.line === null || original.column === null) return {};
      return {
        fileName: normalizeSourceMapFileName(original.source),
        lineNumber: original.line,
        columnNumber: original.column + 1
      };
    }

    const sourceFile = this.blobToFileMap.get(generatedFile);
    return {
      fileName: sourceFile ?? generatedFile,
      lineNumber,
      columnNumber
    };
  }

  private processStackTrace(stack?: string): string | undefined {
    if (!stack) return stack;

    // 替换堆栈中的 blob URL 为源文件名
    let processedStack = stack;
    this.blobToFileMap.forEach((fileName, blobUrl) => {
      const locationRegex = new RegExp(`${escapeRegExp(blobUrl)}:(\\d+):(\\d+)`, 'g');
      processedStack = processedStack.replace(locationRegex, (match, line, column) => {
        const location = this.resolveGeneratedLocation(blobUrl, Number(line), Number(column));
        return location.fileName && location.lineNumber !== undefined && location.columnNumber !== undefined
          ? `${location.fileName}:${location.lineNumber}:${location.columnNumber}`
          : match;
      });
      if (!this.sourceMaps.has(blobUrl)) {
        processedStack = processedStack.replace(new RegExp(escapeRegExp(blobUrl), 'g'), fileName);
      }
    });

    // 优先保留所有包含用户源文件名的堆栈行
    const fileNames = Array.from(this.blobToFileMap.values());
    const lines = processedStack.split('\n');
    const userLines = lines.filter((line) => (
      fileNames.some((fileName) => line.includes(fileName))
      || /\bat .*\(?[^()]+\.[cm]?[jt]sx?:\d+:\d+/.test(line)
    ));
    if (userLines.length > 0) {
      return userLines.join('\n');
    }
    // 如果没有用户源文件名，保留所有 blob: 链接相关的行
    const blobLines = lines.filter(line => /blob:[^\s):]+/.test(line));
    if (blobLines.length > 0) {
      return blobLines.join('\n');
    }
    // 否则只保留第一行（错误类型+message）
    return lines[0];
  }
}
