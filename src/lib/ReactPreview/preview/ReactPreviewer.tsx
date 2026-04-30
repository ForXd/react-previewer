// ReactPreviewer.tsx (重构后的版本)
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
    error: null,
    compileDuration: null,
    transformedFiles: 0
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
    setIsInspecting(prev => !prev);
    logger.debug('Inspect mode toggled:', !isInspecting);
  }, [isInspecting]);

  const handleRecompile = useCallback(() => {
    // 通过改变 key 来强制 PreviewFrame 重新渲染
    setRecompileKey(prev => prev + 1);
    logger.info('Forcing recompile with new key:', recompileKey + 1);
  }, [recompileKey]);

  const handleStatusChange = useCallback((nextStatus: PreviewStatus) => {
    setStatus(nextStatus);
    onStatusChange?.(nextStatus);
  }, [onStatusChange]);

  const handleZoomChange = useCallback((value: number) => {
    setZoom(Math.min(1.5, Math.max(0.5, value)));
  }, []);

  const frameStyle = useMemo<React.CSSProperties>(() => {
    const width = typeof viewport.width === 'number' ? `${viewport.width}px` : viewport.width;
    const height = typeof viewport.height === 'number' ? `${viewport.height}px` : viewport.height;

    return {
      width,
      height,
      transform: `scale(${zoom})`,
      transformOrigin: 'top center'
    };
  }, [viewport, zoom]);

  return (
    <ErrorBoundary>
      <div className={`flex flex-col h-full w-full bg-slate-100 ${className}`}>
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

        <div className="flex-1 relative w-full min-h-0 overflow-auto p-4">
          <div
            className="mx-auto h-full min-h-[320px] overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 transition-[width,height,transform] duration-200"
            style={frameStyle}
          >
            <PreviewFrame
              key={recompileKey} // 使用 key 来强制重新渲染
              files={files}
              entryFile={entryFile}
              depsInfo={depsInfo}
              onError={onError}
              onElementClick={onElementClick}
              isInspecting={isInspecting}
              onStatusChange={handleStatusChange}
              compileDelay={compileDelay}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};
