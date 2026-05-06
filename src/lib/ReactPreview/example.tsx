import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ReactPreviewer } from './preview/ReactPreviewer';
import { SourceTooltip } from './preview/components/SourceTooltip';
import { demoList } from './test/demo';
import type { SourceInfo } from './preview/types';
import { createModuleLogger, type LoggerConfig } from './preview/utils/Logger';

const logger = createModuleLogger('Example');

const ExampleUsage: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState(demoList[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const [loggerConfig, setLoggerConfig] = useState({
    enabled: true,
    level: 2, // INFO level
    showTimestamp: false
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const baseFiles = useMemo(() => {
    const files = { ...selectedDemo.files };
    const filesWithDeps = files as Record<string, string>;
    if ('deps.json' in filesWithDeps) {
      delete filesWithDeps['deps.json'];
    }
    return filesWithDeps;
  }, [selectedDemo]);

  const getFiles = useCallback(() => baseFiles, [baseFiles]);

  const deps = useMemo(() => {
    try {
      const filesWithDeps = selectedDemo.files as Record<string, string>;
      const depsFile = filesWithDeps['deps.json'];
      return depsFile ? JSON.parse(depsFile) : {};
    } catch (error) {
      logger.error('Parse deps.json error:', error);
      return {};
    }
  }, [selectedDemo]);

  // 初始化编辑文件
  useEffect(() => {
    const files = getFiles();
    setEditedFiles(files);
  }, [getFiles]);

  const handleElementClick = (sourceInfo: SourceInfo) => {
    logger.debug('Element clicked in example:', sourceInfo);
    setSourceInfo(sourceInfo);
  };

  const handleCloseSourceTooltip = () => {
    logger.debug('Closing source tooltip from example');
    setSourceInfo(null);
  };

  const handleFileEdit = useCallback((fileName: string, content: string) => {
    setEditedFiles(prev => ({
      ...prev,
      [fileName]: content
    }));
  }, []);

  const handleResetFiles = useCallback(() => {
    setEditedFiles(getFiles());
  }, [getFiles]);

  // 点击外部区域关闭浮窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceInfo && !event.defaultPrevented) {
        logger.debug('Closing source info due to outside click');
        setSourceInfo(null);
      }
    };

    if (sourceInfo) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sourceInfo]);

  // 获取当前要显示的文件（编辑模式使用编辑后的文件，否则使用原始文件）
  const currentFiles = useMemo(() => {
    const files = editingMode ? editedFiles : getFiles();
    logger.debug('getCurrentFiles called:', {
      editingMode,
      selectedDemo: selectedDemo.key,
      filesKeys: Object.keys(files),
      filesHash: JSON.stringify(Object.keys(files).sort())
    });
    return files;
  }, [editingMode, editedFiles, getFiles, selectedDemo.key]);

  return (
    <div ref={containerRef} className="flex h-screen w-full bg-zinc-100 text-zinc-950">
      {/* 左侧边栏 - Demo 选择器 */}
      <div className={`
        flex flex-col border-r border-zinc-200 bg-zinc-950 text-white shadow-xl shadow-zinc-950/10 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
      `}>
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-base font-semibold text-white">React Previewer</h2>
              <p className="mt-1 text-xs text-zinc-400">组件示例与实时预览</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <svg
              className={`h-5 w-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Demo 列表 */}
        <div className="flex-1 overflow-y-auto p-3">
          {sidebarCollapsed ? (
            // 收起状态：只显示图标
            <div className="space-y-2">
              {demoList.map((demo, index) => (
                <button
                  key={demo.key}
                  onClick={() => setSelectedDemo(demo)}
                  className={`
                    flex w-full items-center justify-center rounded-md p-3 transition-colors duration-150
                    ${selectedDemo.key === demo.key
                      ? 'bg-cyan-400 text-zinc-950'
                      : 'bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                  title={demo.name}
                >
                  <span className="text-sm font-bold">{index + 1}</span>
                </button>
              ))}
            </div>
          ) : (
            // 展开状态：显示完整信息
            <div className="space-y-2">
              {demoList.map((demo) => (
                <button
                  key={demo.key}
                  onClick={() => setSelectedDemo(demo)}
                  className={`
                    w-full rounded-md border p-3 text-left transition-colors duration-150
                    ${selectedDemo.key === demo.key
                      ? 'border-cyan-300/60 bg-cyan-400 text-zinc-950 shadow-sm shadow-cyan-950/20'
                      : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
                    }
                  `}
                >
                  <div className="mb-1 text-sm font-semibold">{demo.name}</div>
                  <div className="text-xs leading-relaxed opacity-75">{demo.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 日志配置区域 */}
        {!sidebarCollapsed && (
          <div className="border-t border-white/10 bg-black/10 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">日志配置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loggerConfig.enabled}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2 accent-cyan-400"
                />
                <span className="text-xs text-zinc-300">启用日志</span>
              </label>
              <div>
                <label className="mb-1 block text-xs text-zinc-300">日志级别</label>
                <select
                  value={loggerConfig.level}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-white outline-none focus:border-cyan-300"
                >
                  <option value={0}>ERROR</option>
                  <option value={1}>WARN</option>
                  <option value={2}>INFO</option>
                  <option value={3}>DEBUG</option>
                  <option value={4}>TRACE</option>
                </select>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loggerConfig.showTimestamp}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, showTimestamp: e.target.checked }))}
                  className="mr-2 accent-cyan-400"
                />
                <span className="text-xs text-zinc-300">显示时间戳</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 右侧主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶部工具栏 */}
        <div className="border-b border-zinc-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 ring-1 ring-cyan-200">Demo</span>
                <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200">{selectedDemo.entryFile}</span>
              </div>
              <h1 className="text-xl font-semibold text-zinc-950">{selectedDemo.name}</h1>
              <p className="mt-1 text-sm text-zinc-600">{selectedDemo.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingMode(!editingMode)}
                className={`
                  rounded-md px-4 py-2 text-sm font-medium shadow-sm transition-colors
                  ${editingMode 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }
                `}
              >
                {editingMode ? '退出编辑' : '实时编辑'}
              </button>
              {editingMode && (
                <button
                  onClick={handleResetFiles}
                  className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
                >
                  重置
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex min-h-0 flex-1">
          {/* 编辑区域 */}
          {editingMode && (
            <div className="w-1/2 overflow-y-auto border-r border-zinc-200 bg-white p-4">
              <h3 className="mb-4 text-base font-semibold text-zinc-950">文件编辑</h3>
              <div className="space-y-4">
                {Object.entries(currentFiles).map(([fileName, content]) => (
                  <div key={fileName}>
                    <h4 className="mb-2 text-sm font-medium text-zinc-700">{fileName}</h4>
                    <textarea
                      value={content}
                      onChange={(e) => handleFileEdit(fileName, e.target.value)}
                      className="h-32 w-full resize-none rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-900 outline-none transition focus:border-cyan-400 focus:bg-white"
                      placeholder="输入代码..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 预览区域 */}
          <div className={`${editingMode ? 'w-1/2' : 'w-full'} relative min-w-0`}>
            <div className="absolute inset-0">
              {(() => {
                logger.debug('Rendering ReactPreviewer:', {
                  selectedDemo: selectedDemo.key,
                  files: Object.keys(currentFiles),
                  deps: Object.keys(deps),
                  entryFile: selectedDemo.entryFile
                });
                return (
                  <ReactPreviewer
                    files={currentFiles}
                    depsInfo={deps}
                    entryFile={selectedDemo.entryFile}
                    onElementClick={handleElementClick}
                    loggerConfig={loggerConfig as Partial<LoggerConfig>}
                  />
                );
              })()}
            </div>
          </div>
        </div>

        {/* 依赖加载功能说明区域 */}
        {(selectedDemo.key === 'simpleReactDemo' || selectedDemo.key === 'dependencyLoadingDemo' || selectedDemo.key === 'arcoDesignDemo' || selectedDemo.key === 'antdDesignDemo') && (
          <div className="border-t border-zinc-200 bg-white px-6 py-4">
            <h3 className="mb-2 text-sm font-semibold text-zinc-950">依赖加载功能说明</h3>
            <div className="space-y-1 text-xs text-zinc-600">
              <p><strong>观察要点:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>页面加载时应该显示依赖加载进度条</li>
                <li>进度条显示每个依赖的加载状态（等待中、加载中、已加载、加载失败）</li>
                <li>加载完成后进度条自动消失</li>
                <li>如果依赖加载失败，会显示错误状态</li>
              </ul>
              <p className="mt-2"><strong>当前依赖:</strong> {Object.keys(deps).length > 0 ? Object.keys(deps).join(', ') : '无外部依赖'}</p>
            </div>
          </div>
        )}
      </div>

      {/* 源代码提示浮窗 */}
      {sourceInfo && (
        <SourceTooltip
          sourceInfo={sourceInfo}
          containerElement={containerRef.current || document.body}
          onClose={handleCloseSourceTooltip}
        />
      )}
    </div>
  );
};

export default ExampleUsage;
