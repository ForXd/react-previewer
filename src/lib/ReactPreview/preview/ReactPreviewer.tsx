// ReactPreviewer.tsx (重构后的版本)
import React, { useState, useCallback } from 'react';
import type { ReactPreviewerProps, SourceInfo } from './types';
import { PreviewFrame } from './components/PreviewFrame';
import { PreviewerToolbar } from './components/PreviewerToolbar';
import { ErrorBoundary } from './components/ErrorBoundary';

export const ReactPreviewer: React.FC<ReactPreviewerProps> = ({ 
  files, 
  entryFile = 'App.tsx', 
  onError, 
  depsInfo,
  onElementClick
}) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [recompileKey, setRecompileKey] = useState(0);

  const handleToggleInspect = useCallback(() => {
    setIsInspecting(prev => !prev);
  }, []);

  const handleRecompile = useCallback(() => {
    // 通过改变 key 来强制 PreviewFrame 重新渲染
    setRecompileKey(prev => prev + 1);
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full w-full">
        <PreviewerToolbar
          isLoading={false} // 加载状态现在由 PreviewFrame 管理
          isInspecting={isInspecting}
          onRecompile={handleRecompile}
          onToggleInspect={handleToggleInspect}
        />

        <div className="flex-1 relative w-full">
          <PreviewFrame
            key={recompileKey} // 使用 key 来强制重新渲染
            files={files}
            entryFile={entryFile}
            depsInfo={depsInfo}
            onError={onError}
            onElementClick={onElementClick}
            isInspecting={isInspecting}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};