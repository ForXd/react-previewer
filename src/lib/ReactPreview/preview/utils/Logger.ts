const LogLevel = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
  showTimestamp?: boolean;
}

class Logger {
  private config: LoggerConfig = {
    enabled: false,
    level: LogLevel.INFO,
    prefix: '[ReactPreview]',
    showTimestamp: false
  };

  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level <= this.config.level;
  }

  private formatMessage(level: string, message: string): string {
    const parts: string[] = [];
    
    if (this.config.showTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    if (this.config.prefix) {
      parts.push(this.config.prefix);
    }
    
    parts.push(`[${level}]`);
    parts.push(message);
    
    return parts.join(' ');
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.TRACE)) {
      console.trace(this.formatMessage('TRACE', message), ...args);
    }
  }

  module(moduleName: string) {
    return {
      error: (message: string, ...args: unknown[]) => 
        this.error(`[${moduleName}] ${message}`, ...args),
      warn: (message: string, ...args: unknown[]) => 
        this.warn(`[${moduleName}] ${message}`, ...args),
      info: (message: string, ...args: unknown[]) => 
        this.info(`[${moduleName}] ${message}`, ...args),
      debug: (message: string, ...args: unknown[]) => 
        this.debug(`[${moduleName}] ${message}`, ...args),
      trace: (message: string, ...args: unknown[]) => 
        this.trace(`[${moduleName}] ${message}`, ...args)
    };
  }
}

export const logger = Logger.getInstance();
export const createModuleLogger = (moduleName: string) => logger.module(moduleName);
