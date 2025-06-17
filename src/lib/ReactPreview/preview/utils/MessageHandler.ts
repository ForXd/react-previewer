// utils/MessageHandler.ts (修复版本)
import type { MessageData, ErrorInfo, SourceInfo } from '../types';
import { ErrorHandler } from './ErrorHandler';

export class MessageHandler {
  private errorHandler: ErrorHandler;
  private onError?: (error: Error) => void;
  private onElementClick?: (data: any) => void;

  constructor(
    errorHandler: ErrorHandler,
    callbacks: {
      onError?: (error: Error) => void;
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
      
      console.log('MessageHandler received:', type, data);
      
      // 验证消息格式
      if (!type || typeof type !== 'string') {
        console.warn('Invalid message type:', type);
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
        default:
          console.warn('Unknown message type:', type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private handleRuntimeError(errorData: any): void {
    try {
      const errorInfo = this.errorHandler.processRuntimeError(errorData);
      this.onError?.(new Error(errorInfo.message));
    } catch (error) {
      console.error('Error processing runtime error:', error);
    }
  }

  private handleElementClick(data: any): void {
    try {
      // 验证数据格式
      if (!data || typeof data !== 'object') {
        console.warn('Invalid element click data:', data);
        return;
      }

      const { file, startLine, endLine, startColumn, endColumn, x, y } = data;
      
      if (typeof file !== 'string' || typeof startLine !== 'number' || typeof endLine !== 'number' ||
          typeof startColumn !== 'number' || typeof endColumn !== 'number' ||
          typeof x !== 'number' || typeof y !== 'number') {
        console.warn('Invalid element click data format:', data);
        return;
      }

      console.log('MessageHandler calling onElementClick with:', data);
      this.onElementClick?.(data);
    } catch (error) {
      console.error('Error handling element click:', error);
    }
  }

  private handleConsoleLog(data: any): void {
    try {
      if (data && Array.isArray(data.args)) {
        console.log('[Preview]', ...data.args);
      }
    } catch (error) {
      console.error('Error handling console log:', error);
    }
  }
}