// 导入样式文件
import './styles.css';

// 主组件导出
export { ReactPreviewer } from './preview/ReactPreviewer';

// 类型导出
export type {
  ReactPreviewerProps,
  ErrorInfo,
  SourceInfo,
  MessageData,
  TransformedFile
} from './preview/types';

// 编译器相关导出
export type {
  TransformOptions,
  FileSystem,
  DependencyNode,
  FileProcessor,
  ASTProcessor,
  DependencyAnalyzer
} from './compiler/types';

// 工具函数导出
export { logger, createModuleLogger } from './preview/utils/Logger';
export type { LoggerConfig } from './preview/utils/Logger';

// 常量导出
export { 
  COMPONENT_LIBRARY_STYLE,
  DEFAULT_DEPENDENCIES,
  TRANSFORM_OPTIONS
} from './preview/constant';

// 错误处理工具
export { ErrorBoundary } from './preview/components/ErrorBoundary';
export { ErrorDisplay } from './preview/components/ErrorDisplay';

// 预览器组件
export { PreviewFrame } from './preview/components/PreviewFrame';
export { PreviewerToolbar } from './preview/components/PreviewerToolbar';
export { LoadingOverlay } from './preview/components/LoadingOverlay';
export { SourceTooltip } from './preview/components/SourceTooltip';
export { DebugPanel } from './preview/components/DebugPanel';

// 编译器工具
export { CodeTransformer } from './compiler/CodeTransformer';
export { TypeScriptDependencyAnalyzer } from './compiler/dependency/DependencyAnalyzer';
export { DependencyGraph } from './compiler/dependency/DependencyGraph';
export { DependencyGraphBuilder } from './compiler/dependency/DependencyGraphBuilder';

// 工具函数
export {
  createJSXAttribute,
  hasAttribute,
  resolveRelativePath,
  getResolvedFilename
} from './compiler/utils';

// 预览器工具
export * from './preview/utils/ErrorHandler';
export * from './preview/utils/FileProcessor';
export * from './preview/utils/HTMLGenerator';
export * from './preview/utils/MessageHandler'; 