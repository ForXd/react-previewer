// types.ts
import type { LoggerConfig } from './utils/Logger';

export interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
  entryFile?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  loggerConfig?: Partial<LoggerConfig>;
  compileDelay?: number;
  showToolbar?: boolean;
  className?: string;
  defaultViewport?: PreviewViewport;
  defaultZoom?: number;
  onStatusChange?: (status: PreviewStatus) => void;
}

export interface PreviewViewport {
  label: string;
  width: number | '100%';
  height: number | '100%';
}

export interface PreviewStatus {
  isLoading: boolean;
  phase: PreviewPhase;
  error: ErrorInfo | null;
  compileDuration: number | null;
  transformedFiles: number;
  resourceTotal: number;
  resourceLoaded: number;
  resourceProgress: number;
}

export type PreviewPhase =
  | 'idle'
  | 'compiling'
  | 'loading-js'
  | 'loading-css'
  | 'rendering'
  | 'ready'
  | 'error';

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
  type:
    | 'runtime-error'
    | 'element-click'
    | 'console-log'
    | 'toggle-inspect'
    | 'dependency-error'
    | 'resource-error'
    | 'resource-status'
    | 'preview-ready';
  data: Record<string, unknown>;
}

export interface TransformedFile {
  content: string;
  url: string;
}
