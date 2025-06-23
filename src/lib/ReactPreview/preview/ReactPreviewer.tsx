// ReactPreviewer.tsx (重构后的版本)
import React, { useState, useCallback, useEffect } from 'react';
import type { ReactPreviewerProps } from './types';
import type { CompilerType } from '../compiler/types';
import { PreviewFrame } from './components/PreviewFrame';
import { PreviewerToolbar } from './components/PreviewerToolbar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/Logger';

export const ReactPreviewer: React.FC<ReactPreviewerProps> = ({ 
  files, 
  entryFile = 'App.tsx', 
  onError, 
  depsInfo,
  onElementClick,
  loggerConfig,
  compilerConfig,
  onCompilationStart,
  onCompilationComplete
}) => {
  const [isInspecting, setIsInspecting] = useState(false);
  const [recompileKey, setRecompileKey] = useState(0);
  const [compilerType, setCompilerType] = useState<CompilerType>(
    compilerConfig?.type || 'babel'
  );

  // 配置日志系统
  useEffect(() => {
    if (loggerConfig) {
      logger.configure(loggerConfig);
      logger.info('Logger configured with:', loggerConfig);
    }
  }, [loggerConfig]);

  // 配置编译器
  useEffect(() => {
    if (compilerConfig?.type && compilerConfig.type !== compilerType) {
      setCompilerType(compilerConfig.type);
      logger.info('Compiler type changed to:', compilerConfig.type);
    }
  }, [compilerConfig?.type, compilerType]);

  const handleToggleInspect = useCallback(() => {
    setIsInspecting(prev => !prev);
    logger.debug('Inspect mode toggled:', !isInspecting);
  }, [isInspecting]);

  const handleRecompile = useCallback(() => {
    // 通过改变 key 来强制 PreviewFrame 重新渲染
    setRecompileKey(prev => prev + 1);
    logger.info('Forcing recompile with new key:', recompileKey + 1);
  }, [recompileKey]);

  const handleCompilerChange = useCallback((newCompilerType: CompilerType) => {
    setCompilerType(newCompilerType);
    logger.info('Compiler changed to:', newCompilerType);
    // 切换编译器时自动重新编译
    handleRecompile();
  }, [handleRecompile]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full w-full">
        <PreviewerToolbar
          isLoading={false} // 加载状态现在由 PreviewFrame 管理
          isInspecting={isInspecting}
          onRecompile={handleRecompile}
          onToggleInspect={handleToggleInspect}
          compilerType={compilerType}
          onCompilerChange={handleCompilerChange}
          availableCompilers={['babel', 'swc']}
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
            compilerType={compilerType}
            onCompilationStart={onCompilationStart}
            onCompilationComplete={onCompilationComplete}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};