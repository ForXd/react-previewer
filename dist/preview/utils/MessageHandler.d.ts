import { ErrorInfo } from '../types';
import { ErrorHandler } from './ErrorHandler';
export interface ElementClickData {
    file: string;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
    x: number;
    y: number;
}
interface DependencyErrorData {
    name: string;
    url: string;
    error: string;
}
export declare class MessageHandler {
    private errorHandler;
    private onError?;
    private onElementClick?;
    private onDependencyError?;
    constructor(errorHandler: ErrorHandler, callbacks: {
        onError?: (error: ErrorInfo) => void;
        onElementClick?: (data: ElementClickData) => void;
        onDependencyError?: (data: DependencyErrorData) => void;
    });
    handleMessage(event: MessageEvent): void;
    private handleRuntimeError;
    private handleElementClick;
    private handleConsoleLog;
    private handleDependencyError;
}
export {};
//# sourceMappingURL=MessageHandler.d.ts.map