// utils/MessageHandler.ts (修复版本)
import type { MessageData, ErrorInfo } from '../types';
import { ErrorHandler } from './ErrorHandler';
import { createModuleLogger } from './Logger';

const logger = createModuleLogger('MessageHandler');

interface ElementClickData {
  file: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  x: number;
  y: number;
}

interface ConsoleLogData {
  args: unknown[];
}

interface DependencyErrorData {
  name: string;
  url: string;
  error: string;
}

export class MessageHandler {
  private errorHandler: ErrorHandler;
  private onError?: (error: ErrorInfo) => void;
  private onElementClick?: (data: ElementClickData) => void;
  private onDependencyError?: (data: DependencyErrorData) => void;

  constructor(
    errorHandler: ErrorHandler,
    callbacks: {
      onError?: (error: ErrorInfo) => void;
      onElementClick?: (data: ElementClickData) => void;
      onDependencyError?: (data: DependencyErrorData) => void;
    }
  ) {
    this.errorHandler = errorHandler;
    this.onError = callbacks.onError;
    this.onElementClick = callbacks.onElementClick;
    this.onDependencyError = callbacks.onDependencyError;
  }

  handleMessage(event: MessageEvent): void {
    try {
      const { type, data }: MessageData = event.data;
      
      logger.debug('MessageHandler received:', type, data);
      
      // 验证消息格式
      if (!type || typeof type !== 'string') {
        logger.warn('Invalid message type:', type);
        return;
      }
      
      switch (type) {
        case 'runtime-error':
          this.handleRuntimeError(data as Record<string, unknown>);
          break;
        case 'element-click':
          this.handleElementClick(data as unknown as ElementClickData);
          break;
        case 'console-log':
          this.handleConsoleLog(data as unknown as ConsoleLogData);
          break;
        case 'toggle-inspect':
          this.handleToggleInspect(data as Record<string, unknown>);
          break;
        case 'dependency-error':
          this.handleDependencyError(data as unknown as DependencyErrorData);
          break;
        default:
          logger.warn('Unknown message type:', type);
      }
    } catch (error) {
      logger.error('Error handling message:', error);
    }
  }

  private handleRuntimeError(errorData: Record<string, unknown>): void {
    try {
      const errorInfo = this.errorHandler.processRuntimeError(errorData as {
        filename?: string;
        stack?: string;
        message?: string;
        lineno?: number;
        colno?: number;
      });
      this.onError?.(errorInfo);
    } catch (error) {
      logger.error('Error processing runtime error:', error);
    }
  }

  private handleElementClick(data: ElementClickData): void {
    try {
      // 验证数据格式
      if (!data || typeof data !== 'object') {
        logger.warn('Invalid element click data:', data);
        return;
      }

      const { file, startLine, endLine, startColumn, endColumn, x, y } = data;
      
      if (typeof file !== 'string' || typeof startLine !== 'number' || typeof endLine !== 'number' ||
          typeof startColumn !== 'number' || typeof endColumn !== 'number' ||
          typeof x !== 'number' || typeof y !== 'number') {
        logger.warn('Invalid element click data format:', data);
        return;
      }

      logger.debug('MessageHandler calling onElementClick with:', data);
      this.onElementClick?.(data);
    } catch (error) {
      logger.error('Error handling element click:', error);
    }
  }

  private handleConsoleLog(data: ConsoleLogData): void {
    try {
      if (data && Array.isArray(data.args)) {
        logger.debug('[Preview]', ...data.args);
      }
    } catch (error) {
      logger.error('Error handling console log:', error);
    }
  }

  private handleToggleInspect(data: Record<string, unknown>): void {
    try {
      // 处理检查模式切换
      logger.debug('Toggle inspect mode:', data);
    } catch (error) {
      logger.error('Error handling toggle inspect:', error);
    }
  }

  private handleDependencyError(data: DependencyErrorData): void {
    try {
      // 验证数据格式
      if (!data || typeof data !== 'object') {
        logger.warn('Invalid dependency error data:', data);
        return;
      }

      const { name, url, error } = data;
      
      if (typeof name !== 'string' || typeof url !== 'string' || typeof error !== 'string') {
        logger.warn('Invalid dependency error data format:', data);
        return;
      }

      logger.warn(`依赖加载失败: ${name} (${url}) - ${error}`);
      this.onDependencyError?.(data);
    } catch (error) {
      logger.error('Error handling dependency error:', error);
    }
  }
}