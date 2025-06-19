// types.ts
export interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo: Record<string, string>;
  entryFile?: string;
  onError?: (error: Error) => void;
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
  type: 'runtime-error' | 'element-click' | 'console-log' | 'toggle-inspect';
  data: any;
}

export interface TransformedFile {
  content: string;
  url: string;
}