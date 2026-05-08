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
    <div ref={containerRef} className="flex h-screen w-full bg-white text-[#171717]">
      {/* 左侧边栏 - Demo 选择器 */}
      <div className={`
        flex flex-col border-r border-[#ebebeb] bg-white text-[#171717] transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
      `}>
        {/* 侧边栏头部 */}
        <div className="flex items-center justify-between border-b border-[#ebebeb] p-4">
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-base font-semibold text-[#171717]">React Previewer</h2>
              <p className="mt-1 text-xs text-[#666666]">组件示例与实时预览</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-md p-2 text-[#666666] transition-colors hover:bg-[#fafafa] hover:text-[#171717]"
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
                      ? 'bg-[#171717] text-white'
                      : 'bg-white text-[#666666] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]'
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
                    w-full rounded-md p-3 text-left transition-colors duration-150
                    ${selectedDemo.key === demo.key
                      ? 'bg-[#171717] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'
                      : 'bg-white text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]'
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
          <div className="border-t border-[#ebebeb] bg-[#fafafa] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#171717]">日志配置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loggerConfig.enabled}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2 accent-[#171717]"
                />
                <span className="text-xs text-[#4d4d4d]">启用日志</span>
              </label>
              <div>
                <label className="mb-1 block text-xs text-[#4d4d4d]">日志级别</label>
                <select
                  value={loggerConfig.level}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full rounded-md bg-white px-2 py-1 text-xs text-[#171717] shadow-[0_0_0_1px_#ebebeb]"
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
                  className="mr-2 accent-[#171717]"
                />
                <span className="text-xs text-[#4d4d4d]">显示时间戳</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 右侧主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶部工具栏 */}
        <div className="border-b border-[#ebebeb] bg-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#ebf5ff] px-2.5 py-1 text-xs font-medium text-[#0068d6]">Demo</span>
                <span className="rounded-full bg-[#fafafa] px-2.5 py-1 font-mono text-xs font-medium text-[#666666] shadow-[0_0_0_1px_#ebebeb]">{selectedDemo.entryFile}</span>
              </div>
              <h1 className="text-xl font-semibold text-[#171717]">{selectedDemo.name}</h1>
              <p className="mt-1 text-sm text-[#666666]">{selectedDemo.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditingMode(!editingMode)}
                className={`
                  rounded-md px-4 py-2 text-sm font-medium transition-colors
                  ${editingMode 
                    ? 'bg-[#0068d6] text-white hover:bg-[#005ac0]' 
                    : 'bg-[#171717] text-white hover:bg-black'
                  }
                `}
              >
                {editingMode ? '退出编辑' : '实时编辑'}
              </button>
              {editingMode && (
                <button
                  onClick={handleResetFiles}
                  className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] transition-colors hover:bg-[#fafafa] hover:text-[#171717]"
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
            <div className="w-1/2 overflow-y-auto border-r border-[#ebebeb] bg-white p-4">
              <h3 className="mb-4 text-base font-semibold text-[#171717]">文件编辑</h3>
              <div className="space-y-4">
                {Object.entries(currentFiles).map(([fileName, content]) => (
                  <div key={fileName}>
                    <h4 className="mb-2 font-mono text-sm font-medium text-[#4d4d4d]">{fileName}</h4>
                    <textarea
                      value={content}
                      onChange={(e) => handleFileEdit(fileName, e.target.value)}
                      className="h-32 w-full resize-none rounded-md bg-[#fafafa] p-3 font-mono text-xs text-[#171717] shadow-[0_0_0_1px_#ebebeb] transition focus:bg-white"
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
          <div className="border-t border-[#ebebeb] bg-white px-6 py-4">
            <h3 className="mb-2 text-sm font-semibold text-[#171717]">依赖加载功能说明</h3>
            <div className="space-y-1 text-xs text-[#666666]">
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
