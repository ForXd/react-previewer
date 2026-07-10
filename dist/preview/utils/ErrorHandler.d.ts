import { ErrorInfo } from '../types';
import { DependencyErrorPayload } from '../errors';
export declare class ErrorHandler {
    private blobToFileMap;
    private sourceMaps;
    setBlobToFileMap(blobUrls: Map<string, string>, sourceMaps?: Map<string, string>): void;
    processRuntimeError(errorData: {
        filename?: string;
        stack?: string;
        message?: string;
        lineno?: number;
        colno?: number;
    }): ErrorInfo;
    processDependencyError(errorData: DependencyErrorPayload): ErrorInfo;
    processCompileError(error: {
        type?: string;
        filename?: string;
        fileName?: string;
        loc?: {
            line?: number;
            column?: number;
        };
        codeFrame?: string;
        message?: string;
        stack?: string;
        dependencyName?: string;
        dependencyUrl?: string;
        lineNumber?: number;
        columnNumber?: number;
    }): ErrorInfo;
    private resolveStackLocation;
    private resolveGeneratedLocation;
    private processStackTrace;
}
//# sourceMappingURL=ErrorHandler.d.ts.map