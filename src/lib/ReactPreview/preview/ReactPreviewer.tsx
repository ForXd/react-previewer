import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { PreviewRouteState, PreviewStatus, PreviewViewport, ReactPreviewerProps } from './types';
import { PreviewFrame } from './components/PreviewFrame';
import { PreviewerToolbar } from './components/PreviewerToolbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/Logger';

export const ReactPreviewer: React.FC<ReactPreviewerProps> = ({ 
  files, 
  entryFile = 'App.tsx', 
  initialPath = '/',
  onError, 
  depsInfo = {},
  dependencyStyles = {},
  onElementClick,
  onRouteChange,
  loggerConfig,
  compileDelay = 120,
  showToolbar = true,
  className = '',
  defaultViewport,
  defaultZoom = 1,
  onStatusChange
}) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [recompileKey, setRecompileKey] = useState(0);
  const [previewPath, setPreviewPath] = useState(() => normalizePreviewPath(initialPath));
  const [routeInputValue, setRouteInputValue] = useState(() => normalizePreviewPath(initialPath));
  const [status, setStatus] = useState<PreviewStatus>({
    isLoading: true,
    phase: 'compiling',
    error: null,
    compileDuration: null,
    transformedFiles: 0,
    resourceTotal: 0,
    resourceLoaded: 0,
    resourceProgress: 0
  });
  const [viewport, setViewport] = useState<PreviewViewport>(
    defaultViewport ?? { label: 'Auto', width: '100%', height: '100%' }
  );
  const [zoom, setZoom] = useState(defaultZoom);

  const viewportPresets = useMemo<PreviewViewport[]>(() => [
    { label: 'Auto', width: '100%', height: '100%' },
    { label: 'Desktop', width: 1280, height: 800 },
    { label: 'Tablet', width: 820, height: 1180 },
    { label: 'Mobile', width: 390, height: 844 }
  ], []);

  // 配置日志系统
  useEffect(() => {
    if (loggerConfig) {
      logger.configure(loggerConfig);
      logger.info('Logger configured with:', loggerConfig);
    }
  }, [loggerConfig]);

  useEffect(() => {
    const normalizedPath = normalizePreviewPath(initialPath);
    setPreviewPath(normalizedPath);
    setRouteInputValue(normalizedPath);
  }, [initialPath, entryFile]);

  const handleToggleInspect = useCallback(() => {
    setIsInspecting((prev) => {
      logger.debug('Inspect mode toggled:', !prev);
      return !prev;
    });
  }, []);

  const handleRecompile = useCallback(() => {
    setRecompileKey((prev) => {
      logger.info('Forcing recompile with new key:', prev + 1);
      return prev + 1;
    });
  }, []);

  const handleStatusChange = useCallback((nextStatus: PreviewStatus) => {
    setStatus(nextStatus);
    onStatusChange?.(nextStatus);
  }, [onStatusChange]);

  const handleRouteChange = useCallback((route: PreviewRouteState) => {
    setPreviewPath((currentPath) => (currentPath === route.href ? currentPath : route.href));
    setRouteInputValue((currentValue) => (currentValue === route.href ? currentValue : route.href));
    onRouteChange?.(route);
  }, [onRouteChange]);

  const handleRouteSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPath = normalizePreviewPath(routeInputValue);
    setRouteInputValue(normalizedPath);
    setPreviewPath(normalizedPath);
  }, [routeInputValue]);

  const handleZoomChange = useCallback((value: number) => {
    setZoom(Math.min(1.5, Math.max(0.5, value)));
  }, []);

  const frameStyle = useMemo<React.CSSProperties>(() => {
    const width = typeof viewport.width === 'number' ? `${viewport.width}px` : viewport.width;
    const height = typeof viewport.height === 'number'
      ? `${viewport.height + 42}px`
      : viewport.height;

    return {
      width,
      height,
      transform: `scale(${zoom})`,
      transformOrigin: 'top center'
    };
  }, [viewport, zoom]);

  return (
    <ErrorBoundary>
      <div className={`react-previewer flex h-full w-full flex-col bg-white text-[#171717] ${className}`}>
        {showToolbar && (
          <PreviewerToolbar
            isLoading={status.isLoading}
            isInspecting={isInspecting}
            status={status}
            viewport={viewport}
            viewportPresets={viewportPresets}
            zoom={zoom}
            onRecompile={handleRecompile}
            onToggleInspect={handleToggleInspect}
            onViewportChange={setViewport}
            onZoomChange={handleZoomChange}
          />
        )}

        <div className="relative min-h-0 w-full flex-1 overflow-auto bg-[#fafafa] p-5">
          <div
            className="mx-auto flex h-full min-h-[360px] flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04),0_0_0_1px_#fafafa_inset] transition-[width,height,transform] duration-200"
            style={frameStyle}
          >
            <div className="flex h-[42px] flex-none items-center gap-3 border-b border-[#ebebeb] bg-white px-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-[#ff5b4f] ring-1 ring-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#ebebeb] ring-1 ring-black/10" />
                <span className="h-3 w-3 rounded-full bg-[#171717] ring-1 ring-black/10" />
              </div>
              <form
                className="flex min-w-0 flex-1 items-center overflow-hidden rounded-md bg-[#fafafa] text-xs text-[#666666] shadow-[0_0_0_1px_#ebebeb] focus-within:bg-white focus-within:shadow-[0_0_0_1px_#171717]"
                onSubmit={handleRouteSubmit}
              >
                <span className="flex-none border-r border-[#ebebeb] px-3 py-1 font-medium text-[#808080]">preview.local</span>
                <input
                  aria-label="预览路由路径"
                  value={routeInputValue}
                  onChange={(event) => setRouteInputValue(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-2 py-1 font-mono text-xs text-[#4d4d4d] outline-none"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  title="跳转到输入的预览路由"
                  className="flex h-7 w-7 flex-none items-center justify-center border-l border-[#ebebeb] text-[#666666] transition-colors hover:bg-white hover:text-[#171717]"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </button>
              </form>
              <div className="hidden text-xs font-medium text-[#666666] sm:block">{viewport.label}</div>
            </div>
            <div className="min-h-0 flex-1 bg-white">
              <PreviewFrame
                key={recompileKey}
                files={files}
                entryFile={entryFile}
                depsInfo={depsInfo}
                dependencyStyles={dependencyStyles}
                previewPath={previewPath}
                onError={onError}
                onElementClick={onElementClick}
                onRouteChange={handleRouteChange}
                isInspecting={isInspecting}
                onStatusChange={handleStatusChange}
                compileDelay={compileDelay}
              />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

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
