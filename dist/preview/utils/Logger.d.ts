declare const LogLevel: {
    readonly ERROR: 0;
    readonly WARN: 1;
    readonly INFO: 2;
    readonly DEBUG: 3;
    readonly TRACE: 4;
};
type LogLevel = typeof LogLevel[keyof typeof LogLevel];
export interface LoggerConfig {
    enabled: boolean;
    level: LogLevel;
    prefix?: string;
    showTimestamp?: boolean;
}
declare class Logger {
    private config;
    private static instance;
    private constructor();
    static getInstance(): Logger;
    configure(config: Partial<LoggerConfig>): void;
    private shouldLog;
    private formatMessage;
    error(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
    trace(message: string, ...args: unknown[]): void;
    log(message: string, ...args: unknown[]): void;
    module(moduleName: string): {
        error: (message: string, ...args: unknown[]) => void;
        warn: (message: string, ...args: unknown[]) => void;
        info: (message: string, ...args: unknown[]) => void;
        debug: (message: string, ...args: unknown[]) => void;
        trace: (message: string, ...args: unknown[]) => void;
        log: (message: string, ...args: unknown[]) => void;
    };
}
export declare const logger: Logger;
export declare const createModuleLogger: (moduleName: string) => {
    error: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    debug: (message: string, ...args: unknown[]) => void;
    trace: (message: string, ...args: unknown[]) => void;
    log: (message: string, ...args: unknown[]) => void;
};
export {};
//# sourceMappingURL=Logger.d.ts.map