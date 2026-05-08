import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { PreviewStatus, PreviewViewport, ReactPreviewerProps } from './types';
import { PreviewFrame } from './components/PreviewFrame';
import { PreviewerToolbar } from './components/PreviewerToolbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/Logger';

export const ReactPreviewer: React.FC<ReactPreviewerProps> = ({ 
  files, 
  entryFile = 'App.tsx', 
  onError, 
  depsInfo = {},
  dependencyStyles = {},
  onElementClick,
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
              <div className="flex min-w-0 flex-1 items-center rounded-md bg-[#fafafa] px-3 py-1 text-xs text-[#666666] shadow-[0_0_0_1px_#ebebeb]">
                <span className="truncate">preview.local/{entryFile}</span>
              </div>
              <div className="hidden text-xs font-medium text-[#666666] sm:block">{viewport.label}</div>
            </div>
            <div className="min-h-0 flex-1 bg-white">
              <PreviewFrame
                key={recompileKey}
                files={files}
                entryFile={entryFile}
                depsInfo={depsInfo}
                dependencyStyles={dependencyStyles}
                onError={onError}
                onElementClick={onElementClick}
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
