import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  ErrorInfo,
  PreviewErrorRenderer,
  PreviewLoadingRenderer,
  PreviewRouteState,
  PreviewStatus,
  ReactPreviewerClassNames,
  ReactPreviewerStyles,
  SourceInfo
} from '../types';
import { FileProcessor } from '../utils/FileProcessor';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTMLGenerator } from '../utils/HTMLGenerator';
import { MessageHandler } from '../utils/MessageHandler';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorDisplay } from './ErrorDisplay';
import { createModuleLogger } from '../utils/Logger';
import { createDepsHash, createFilesHash, createStylesHash } from '../utils/contentHash';
import { createSourceInfo } from '../utils/sourceSelection';
import type { ElementClickData } from '../utils/MessageHandler';
import { getPreviewCompilerConfigKey, type PreviewCompilerLike } from '../compilers/types';
import {
  createSourceAttributeKey,
  type SourceAttributeNameOverrides
} from '../sourceAttributes';
import { joinClassNames } from '../utils/joinClassNames';

const logger = createModuleLogger('PreviewFrame');

export interface PreviewFrameProps {
  files: Record<string, string>;
  entryFile?: string;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
  previewPath?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  onRouteChange?: (route: PreviewRouteState) => void;
  isInspecting?: boolean;
  onStatusChange?: (status: PreviewStatus) => void;
  compileDelay?: number;
  enableTailwind?: boolean;
  compiler?: PreviewCompilerLike;
  sourceAttributeNames?: SourceAttributeNameOverrides;
  classNames?: ReactPreviewerClassNames;
  styles?: ReactPreviewerStyles;
  renderLoading?: PreviewLoadingRenderer;
  renderError?: PreviewErrorRenderer;
  iframeTitle?: string;
}

const createInitialStatus = (): PreviewStatus => ({
  isLoading: true,
  phase: 'compiling',
  error: null,
  compileDuration: null,
  transformedFiles: 0,
  resourceTotal: 0,
  resourceLoaded: 0,
  resourceProgress: 0
});

const normalizePreviewPath = (path?: string): string => {
  const value = path?.trim();
  if (!value) return '/';

  if (value.startsWith('#')) {
    return `/${value}`;
  }

  try {
    const url = new URL(value, 'https://preview.local');
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value.startsWith('/') ? value : `/${value}`;
  }
};

const toRouteState = (data: Record<string, unknown>): PreviewRouteState => {
  const pathname = typeof data.pathname === 'string' && data.pathname ? data.pathname : '/';
  const search = typeof data.search === 'string' ? data.search : '';
  const hash = typeof data.hash === 'string' ? data.hash : '';
  const href = typeof data.href === 'string' && data.href ? data.href : `${pathname}${search}${hash}`;

  return { pathname, search, hash, href };
};

export function PreviewFrame({
  files,
  entryFile = 'App.tsx',
  depsInfo = {},
  dependencyStyles = {},
  previewPath = '/',
  onError,
  onElementClick,
  onRouteChange,
  isInspecting = false,
  onStatusChange,
  compileDelay = 120,
  enableTailwind = false,
  compiler,
  sourceAttributeNames,
  classNames,
  styles,
  renderLoading,
  renderError,
  iframeTitle = 'React preview'
}: PreviewFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [frameStatus, setFrameStatus] = useState<PreviewStatus>(() => createInitialStatus());
  const [frameVersion, setFrameVersion] = useState(0);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileProcessor = useRef(new FileProcessor());
  const errorHandler = useRef(new ErrorHandler());
  const htmlGenerator = useRef(new HTMLGenerator());
  const messageHandler = useRef<MessageHandler>(null);
  
  // 使用 useRef 跟踪当前处理的文件内容
  const currentFilesRef = useRef<string>('');
  const currentEntryFileRef = useRef<string>('');
  const currentDepsInfoRef = useRef<string>('');
  const currentDependencyStylesRef = useRef<string>('');
  const currentCompilerRef = useRef<string>('');
  const currentSourceAttributeNamesRef = useRef<string>('');
  const currentTailwindRef = useRef<boolean | null>(null);
  const previewPathRef = useRef(normalizePreviewPath(previewPath));
  
  // 使用 useRef 稳定回调函数的引用
  const onElementClickRef = useRef(onElementClick);
  const onErrorRef = useRef(onError);
  const onRouteChangeRef = useRef(onRouteChange);
  const onStatusChangeRef = useRef(onStatusChange);
  const compileRunRef = useRef(0);
  const pendingHtmlRef = useRef<string | null>(null);
  const transformedCountRef = useRef(0);
  const compileDurationRef = useRef<number | null>(null);
  
  onElementClickRef.current = onElementClick;
  onErrorRef.current = onError;
  onRouteChangeRef.current = onRouteChange;
  onStatusChangeRef.current = onStatusChange;
  previewPathRef.current = normalizePreviewPath(previewPath);

  const publishStatus = useCallback((next: Partial<PreviewStatus> = {}) => {
    const nextStatus: PreviewStatus = {
      isLoading,
      phase: isLoading ? 'compiling' : 'idle',
      error: errorInfo,
      compileDuration: compileDurationRef.current,
      transformedFiles: transformedCountRef.current,
      resourceTotal: 0,
      resourceLoaded: 0,
      resourceProgress: 0,
      ...next
    };

    setFrameStatus(nextStatus);
    onStatusChangeRef.current?.(nextStatus);
  }, [errorInfo, isLoading]);

  const handleElementClick = useCallback((data: ElementClickData) => {
    try {
      logger.debug('Element clicked:', data, 'isInspecting:', isInspecting);
      
      if (!isInspecting) {
        logger.debug('Not in inspecting mode, ignoring click');
        return;
      }

      if (!data || !data.file || !data.startLine || !data.endLine || !data.startColumn || !data.endColumn) {
        logger.warn('Missing file or line data');
        return;
      }

      const sourceInfo = createSourceInfo(data, files);
      if (!sourceInfo) {
        logger.warn('File content not found for:', data.file);
        return;
      }

      logger.debug('Resolved source info:', sourceInfo);
      
      onElementClickRef.current?.(sourceInfo);
    } catch (error) {
      logger.error('Error in handleElementClick:', error);
    }
  }, [files, isInspecting]);

  // 初始化消息处理器
  useEffect(() => {
    messageHandler.current = new MessageHandler(errorHandler.current, {
      onError: (errorInfo) => {
        setErrorInfo(errorInfo);
        onErrorRef.current?.(new Error(errorInfo.message));
        publishStatus({
          isLoading: false,
          error: errorInfo
        });
      },
      onElementClick: handleElementClick,
      onDependencyError: (dependencyError) => {
        logger.warn('依赖加载失败:', dependencyError);
        // 可以选择显示依赖错误信息，或者继续尝试加载
        // 这里我们记录错误但不阻止预览继续
      },
    });
  }, [handleElementClick, publishStatus]);

  const writePendingPreviewHtml = useCallback(() => {
    const iframe = iframeRef.current;
    const html = pendingHtmlRef.current;
    if (!iframe || !html) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    pendingHtmlRef.current = null;
    doc.open();
    doc.write(html);
    doc.close();
  }, []);

  const renderPreview = useCallback((fileUrls: Map<string, string>, entry: string) => {
    const entryUrl = fileUrls.get(entry);
    if (!entryUrl) {
      throw new Error(`Entry file ${entry} not found`);
    }

    const html = htmlGenerator.current.generatePreviewHTML(
      entryUrl,
      depsInfo,
      dependencyStyles,
      previewPathRef.current,
      sourceAttributeNames,
      enableTailwind
    );
    pendingHtmlRef.current = html;
    setFrameVersion((version) => version + 1);
  }, [depsInfo, dependencyStyles, enableTailwind, sourceAttributeNames]);

  useEffect(() => {
    writePendingPreviewHtml();
  }, [frameVersion, writePendingPreviewHtml]);

  // 创建一个内部函数来处理文件，可以访问最新的 props
  const processFilesInternal = useCallback(async (runId?: number) => {
    const compileId = runId ?? compileRunRef.current + 1;
    compileRunRef.current = compileId;
    const startedAt = performance.now();

    try {
      setIsLoading(true);
      setErrorInfo(null);
      publishStatus({
        isLoading: true,
        phase: 'compiling',
        error: null
      });

      await fileProcessor.current.configure(compiler);
      await fileProcessor.current.initialize();
      const result = await fileProcessor.current.processFiles(
        files,
        depsInfo,
        entryFile,
        sourceAttributeNames
      );
      if (compileId !== compileRunRef.current) return;
      const fileUrls = result.fileUrls;
      // fileUrls: Map<fileName, blobUrl>
      errorHandler.current.setBlobToFileMap(fileUrls);
      transformedCountRef.current = result.transformedFiles;
      renderPreview(fileUrls, result.entryFile);
      compileDurationRef.current = Math.round(performance.now() - startedAt);
      publishStatus({
        isLoading: true,
        phase: 'loading-js',
        error: null,
        compileDuration: compileDurationRef.current,
        transformedFiles: transformedCountRef.current
      });
    } catch (err) {
      if (compileId !== compileRunRef.current) return;
      const compileError = errorHandler.current.processCompileError(
        err instanceof Error ? err : new Error('Unknown error')
      );
      setErrorInfo(compileError);
      onErrorRef.current?.(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
      publishStatus({
        isLoading: false,
        phase: 'error',
        error: compileError
      });
    }
  }, [files, depsInfo, entryFile, compiler, sourceAttributeNames, publishStatus, renderPreview]);

  // 检查文件内容是否真正改变
  useEffect(() => {
    const filesHash = createFilesHash(files);
    const depsInfoKey = createDepsHash(depsInfo);
    const dependencyStylesKey = createStylesHash(dependencyStyles);
    const compilerKey = getPreviewCompilerConfigKey(compiler);
    const sourceAttributeNamesKey = createSourceAttributeKey(sourceAttributeNames);
    
    const newFilesHash = filesHash;
    const newEntryFile = entryFile;
    const newDepsInfoKey = depsInfoKey;
    const newDependencyStylesKey = dependencyStylesKey;
    const newCompilerKey = compilerKey;
    const newSourceAttributeNamesKey = sourceAttributeNamesKey;
    const newEnableTailwind = enableTailwind;
    
    // 只有当文件内容真正改变时才重新处理
    if (
      currentFilesRef.current !== newFilesHash ||
      currentEntryFileRef.current !== newEntryFile ||
      currentDepsInfoRef.current !== newDepsInfoKey ||
      currentDependencyStylesRef.current !== newDependencyStylesKey ||
      currentCompilerRef.current !== newCompilerKey ||
      currentSourceAttributeNamesRef.current !== newSourceAttributeNamesKey ||
      currentTailwindRef.current !== newEnableTailwind
    ) {
      logger.debug('PreviewFrame: File content changed, reprocessing files');
      logger.debug('Files hash changed:', {
        old: currentFilesRef.current,
        new: newFilesHash
      });
      const scheduledRun = compileRunRef.current + 1;
      compileRunRef.current = scheduledRun;
      
      const timer = window.setTimeout(() => {
        currentFilesRef.current = newFilesHash;
        currentEntryFileRef.current = newEntryFile;
        currentDepsInfoRef.current = newDepsInfoKey;
        currentDependencyStylesRef.current = newDependencyStylesKey;
        currentCompilerRef.current = newCompilerKey;
        currentSourceAttributeNamesRef.current = newSourceAttributeNamesKey;
        currentTailwindRef.current = newEnableTailwind;
        processFilesInternal(scheduledRun);
      }, Math.max(0, compileDelay));

      return () => window.clearTimeout(timer);
    }
  }, [
    files,
    entryFile,
    depsInfo,
    dependencyStyles,
    compiler,
    sourceAttributeNames,
    enableTailwind,
    processFilesInternal,
    compileDelay
  ]);

  // 监听iframe内的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.source !== iframeRef.current?.contentWindow) return;
        logger.debug('Received message:', event.data);
        
        // 处理 iframe 请求检查模式状态的消息
        if (event.data.type === 'request-inspect-state') {
          logger.debug('Iframe requested inspect state, sending:', isInspecting);
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'toggle-inspect',
              enabled: isInspecting
            }, '*');
          }
          return;
        }

        if (event.data.type === 'resource-status') {
          const data = event.data.data || {};
          publishStatus({
            isLoading: true,
            phase: data.phase || 'loading-js',
            resourceTotal: Number(data.resourceTotal) || 0,
            resourceLoaded: Number(data.resourceLoaded) || 0,
            resourceProgress: Number(data.resourceProgress) || 0,
            currentResource: typeof data.currentResource === 'string' ? data.currentResource : undefined
          });
          return;
        }

        if (event.data.type === 'preview-ready') {
          const data = event.data.data || {};
          setIsLoading(false);
          publishStatus({
            isLoading: false,
            phase: 'ready',
            error: null,
            resourceTotal: Number(data.resourceTotal) || 0,
            resourceLoaded: Number(data.resourceLoaded) || 0,
            resourceProgress: 100
          });
          return;
        }

        if (event.data.type === 'route-change') {
          const data = event.data.data || {};
          const routeState = toRouteState(data);
          onRouteChangeRef.current?.(routeState);
          return;
        }

        if (event.data.type === 'resource-error') {
          logger.warn('资源加载失败:', event.data.data);
          return;
        }
        
        messageHandler.current?.handleMessage(event);
      } catch (error) {
        logger.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isInspecting, publishStatus]);

  useEffect(() => {
    const normalizedPath = normalizePreviewPath(previewPath);
    previewPathRef.current = normalizedPath;

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'navigate-preview',
        path: normalizedPath
      }, '*');
    }
  }, [previewPath]);

  // 监听检查模式变化，同步到 iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'toggle-inspect',
        enabled: isInspecting
      }, '*');
    }
  }, [isInspecting]);

  // 清理资源
  useEffect(() => {
    const processor = fileProcessor.current;
    return () => {
      compileRunRef.current += 1;
      pendingHtmlRef.current = null;
      processor.dispose();
    };
  }, []);

  return (
    <div className="react-previewer__surface">
      {isLoading && (
        renderLoading ? (
          <div
            className={joinClassNames('react-previewer__loading', classNames?.loading)}
            style={styles?.loading}
          >
            {renderLoading(frameStatus)}
          </div>
        ) : (
          <LoadingOverlay
            status={frameStatus}
            className={classNames?.loading}
            style={styles?.loading}
          />
        )
      )}
      
      {errorInfo && (
        renderError ? (
          <div
            className={joinClassNames('react-previewer__error', classNames?.error)}
            style={styles?.error}
          >
            {renderError(errorInfo, files)}
          </div>
        ) : (
          <ErrorDisplay
            error={errorInfo}
            files={files}
            className={classNames?.error}
            style={styles?.error}
          />
        )
      )}

      <iframe
        key={frameVersion}
        ref={iframeRef}
        title={iframeTitle}
        className={joinClassNames(
          'react-previewer__iframe',
          isLoading && 'react-previewer__iframe--loading',
          classNames?.iframe
        )}
        style={styles?.iframe}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
