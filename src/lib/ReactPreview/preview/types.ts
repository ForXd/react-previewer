// types.ts
import type { LoggerConfig } from './utils/Logger';
import type { CompilerType, CompilerOptions } from '../compiler/types';

export interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo: Record<string, string>;
  entryFile?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  loggerConfig?: Partial<LoggerConfig>;
  compilerConfig?: CompilerConfig;
  onCompilationStart?: () => void;
  onCompilationComplete?: (duration: number) => void;
}

export interface CompilerConfig {
  type?: CompilerType;
  options?: CompilerOptions;
  autoFallback?: boolean; // 是否在编译失败时自动回退到其他策略
}

export interface ErrorInfo {
  type: 'compile' | 'runtime';
  message: string;
  stack?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  codeFrame?: string;
}

export interface SourceInfo {
  file: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  content: string;
  position: { x: number; y: number };
}

export interface MessageData {
  type: 'runtime-error' | 'element-click' | 'console-log' | 'toggle-inspect' | 'dependency-error';
  data: Record<string, unknown>;
}

export interface TransformedFile {
  content: string;
  url: string;
}