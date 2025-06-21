// utils/MessageHandler.ts (修复版本)
import type { MessageData, ErrorInfo, SourceInfo } from '../types';
import { ErrorHandler } from './ErrorHandler';
import { createModuleLogger } from './Logger';

const logger = createModuleLogger('MessageHandler');

export class MessageHandler {
  private errorHandler: ErrorHandler;
  private onError?: (error: ErrorInfo) => void;
  private onElementClick?: (data: any) => void;

  constructor(
    errorHandler: ErrorHandler,
    callbacks: {
      onError?: (error: ErrorInfo) => void;
      onElementClick?: (data: any) => void;
    }
  ) {
    this.errorHandler = errorHandler;
    this.onError = callbacks.onError;
    this.onElementClick = callbacks.onElementClick;
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
          this.handleRuntimeError(data);
          break;
        case 'element-click':
          this.handleElementClick(data);
          break;
        case 'console-log':
          this.handleConsoleLog(data);
          break;
        case 'toggle-inspect':
          this.handleToggleInspect(data);
          break;
        default:
          logger.warn('Unknown message type:', type);
      }
    } catch (error) {
      logger.error('Error handling message:', error);
    }
  }

  private handleRuntimeError(errorData: any): void {
    try {
      const errorInfo = this.errorHandler.processRuntimeError(errorData);
      this.onError?.(errorInfo);
    } catch (error) {
      logger.error('Error processing runtime error:', error);
    }
  }

  private handleElementClick(data: any): void {
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

  private handleConsoleLog(data: any): void {
    try {
      if (data && Array.isArray(data.args)) {
        logger.debug('[Preview]', ...data.args);
      }
    } catch (error) {
      logger.error('Error handling console log:', error);
    }
  }

  private handleToggleInspect(data: any): void {
    try {
      // 处理检查模式切换
      logger.debug('Toggle inspect mode:', data);
    } catch (error) {
      logger.error('Error handling toggle inspect:', error);
    }
  }
}