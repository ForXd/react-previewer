// utils/ErrorHandler.ts
import type { ErrorInfo } from '../types';

export class ErrorHandler {
  private blobToFileMap: Map<string, string> = new Map();

  setBlobToFileMap(blobUrls: Map<string, string>): void {
    this.blobToFileMap.clear();
    blobUrls.forEach((blobUrl, fileName) => {
      console.log('setBlobToFileMap:', blobUrl, fileName);
      this.blobToFileMap.set(blobUrl, fileName);
    });
  }

  processRuntimeError(errorData: any): ErrorInfo {
    let fileName = errorData.filename;
    // 优先从 stack trace 的每一行用正则提取 blob: 链接并映射为用户文件名
    if (errorData.stack && this.blobToFileMap.size > 0) {
      const lines = errorData.stack.split('\n');
      for (const line of lines) {
        console.log('stack line:', line);
        const match = line.match(/(blob:[^)]*):\d+:\d+/);
        if (match && match[1]) {
          console.log('matched blob url:', match[1]);
          const mapped = this.blobToFileMap.get(match[1]);
          console.log('mapped fileName:', mapped);
          if (mapped) {
            fileName = mapped;
            break;
          }
        }
      }
      console.log('runtime-error fileName:', fileName, errorData.stack, this.blobToFileMap);
    }
    // 如果错误文件是 blob URL，转换为源文件名
    if (fileName && fileName.startsWith('blob:')) {
      const sourceFile = this.blobToFileMap.get(fileName);
      if (sourceFile) {
        fileName = sourceFile;
      }
    }
    // 如果没有 fileName，但 stack 里有 blob 映射，也尝试提取
    if (!fileName && errorData.stack) {
      for (const [blobUrl, srcFile] of this.blobToFileMap.entries()) {
        if (errorData.stack.includes(blobUrl)) {
          fileName = srcFile;
          break;
        }
      }
      if (!fileName) {
        const match = errorData.stack.match(/(blob:[^\s)]+)/);
        if (match && match[1]) {
          const mapped = this.blobToFileMap.get(match[1]);
          if (mapped) fileName = mapped;
        }
      }
    }

    return {
      type: 'runtime',
      message: errorData.message || 'Runtime error occurred',
      stack: this.processStackTrace(errorData.stack),
      fileName,
      lineNumber: errorData.lineno,
      columnNumber: errorData.colno,
    };
  }

  processCompileError(error: any): ErrorInfo {

    console.log("processCompileError: =======", error);
    // 尝试解析 Babel 错误对象的详细信息
    let fileName = error.filename || error.fileName;
    // blob 映射回真实文件名
    if (fileName && fileName.startsWith('blob:')) {
      const mapped = this.blobToFileMap.get(fileName);
      if (mapped) fileName = mapped;
    }
    let lineNumber = error.loc?.line;
    let columnNumber = error.loc?.column;
    let codeFrame = error.codeFrame;
    let message = error.message;
    // 有些 message 里会重复 codeFrame，去掉
    if (codeFrame && message && message.includes(codeFrame)) {
      message = message.replace(codeFrame, '').trim();
    }
    return {
      type: 'compile',
      message,
      stack: error.stack,
      fileName,
      lineNumber,
      columnNumber,
      codeFrame,
    };
  }

  private processStackTrace(stack?: string): string | undefined {
    if (!stack) return stack;

    // 替换堆栈中的 blob URL 为源文件名
    let processedStack = stack;
    this.blobToFileMap.forEach((fileName, blobUrl) => {
      const regex = new RegExp(blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      processedStack = processedStack.replace(regex, fileName);
    });

    // 优先保留所有包含用户源文件名的堆栈行
    const fileNames = Array.from(this.blobToFileMap.values());
    const lines = processedStack.split('\n');
    const userLines = lines.filter(line => fileNames.some(f => line.includes(f)));
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