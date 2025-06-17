// utils/ErrorHandler.ts
import type { ErrorInfo } from '../types';

export class ErrorHandler {
  private blobToFileMap: Map<string, string> = new Map();

  setBlobToFileMap(blobUrls: Map<string, string>): void {
    this.blobToFileMap.clear();
    blobUrls.forEach((url, fileName) => {
      this.blobToFileMap.set(url, fileName);
    });
  }

  processRuntimeError(errorData: any): ErrorInfo {
    let fileName = errorData.filename;
    
    // 如果错误文件是 blob URL，转换为源文件名
    if (fileName && fileName.startsWith('blob:')) {
      const sourceFile = this.blobToFileMap.get(fileName);
      if (sourceFile) {
        fileName = sourceFile;
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

  processCompileError(error: Error): ErrorInfo {
    return {
      type: 'compile',
      message: error.message,
      stack: error.stack,
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

    return processedStack;
  }
}