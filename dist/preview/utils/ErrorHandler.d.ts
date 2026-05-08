import { ErrorInfo } from '../types';
export declare class ErrorHandler {
    private blobToFileMap;
    setBlobToFileMap(blobUrls: Map<string, string>): void;
    processRuntimeError(errorData: {
        filename?: string;
        stack?: string;
        message?: string;
        lineno?: number;
        colno?: number;
    }): ErrorInfo;
    processCompileError(error: {
        filename?: string;
        fileName?: string;
        loc?: {
            line?: number;
            column?: number;
        };
        codeFrame?: string;
        message?: string;
        stack?: string;
    }): ErrorInfo;
    private processStackTrace;
}
//# sourceMappingURL=ErrorHandler.d.ts.map