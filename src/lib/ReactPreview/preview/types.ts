import type { CSSProperties, ReactNode } from 'react';
import type { LoggerConfig } from './utils/Logger';
import type { PreviewCompilerLike } from './compilers/types';
import type { SourceAttributeNameOverrides } from './sourceAttributes';

export interface ReactPreviewerClassNames {
  root?: string;
  loading?: string;
  error?: string;
  iframe?: string;
}

export interface ReactPreviewerStyles {
  root?: CSSProperties;
  loading?: CSSProperties;
  error?: CSSProperties;
  iframe?: CSSProperties;
}

export type PreviewLoadingRenderer = (status: PreviewStatus) => ReactNode;
export type PreviewErrorRenderer = (
  error: ErrorInfo,
  files: Record<string, string>
) => ReactNode;

export interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
  entryFile?: string;
  initialPath?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  onRouteChange?: (route: PreviewRouteState) => void;
  loggerConfig?: Partial<LoggerConfig>;
  compileDelay?: number;
  enableTailwind?: boolean;
  isInspecting?: boolean;
  className?: string;
  style?: CSSProperties;
  classNames?: ReactPreviewerClassNames;
  styles?: ReactPreviewerStyles;
  renderLoading?: PreviewLoadingRenderer;
  renderError?: PreviewErrorRenderer;
  iframeTitle?: string;
  onStatusChange?: (status: PreviewStatus) => void;
  compiler?: PreviewCompilerLike;
  sourceAttributeNames?: SourceAttributeNameOverrides;
}

export interface PreviewRouteState {
  pathname: string;
  search: string;
  hash: string;
  href: string;
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
  currentResource?: string;
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
