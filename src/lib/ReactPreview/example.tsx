import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReactPreviewer } from './preview/ReactPreviewer';
import { SourceTooltip } from './preview/components/SourceTooltip';
import { demoList } from './test/demo';
import type { SourceInfo, CompilerConfig } from './preview/types';
import type { CompilerType, CompilerOptions } from './compiler/types';
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
  
  // 编译策略配置
  const [compilerConfig, setCompilerConfig] = useState<CompilerConfig>({
    type: 'babel',
    options: {
      target: 'es2020',
      jsx: 'react-jsx',
      typescript: true,
      minify: false,
      sourceMaps: false
    },
    autoFallback: true
  });

  // 编译时间相关状态
  const [compilationTime, setCompilationTime] = useState<number | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const getFiles = useCallback(() => {
    const files = { ...selectedDemo.files };
    const filesWithDeps = files as Record<string, string>;
    if ('deps.json' in filesWithDeps) {
      delete filesWithDeps['deps.json'];
    }
    return filesWithDeps;
  }, [selectedDemo]);

  // 初始化编辑文件
  useEffect(() => {
    const files = getFiles();
    setEditedFiles(files);
  }, [getFiles]);

  const getDeps = () => {
    try {
      const filesWithDeps = selectedDemo.files as Record<string, string>;
      const depsFile = filesWithDeps['deps.json'];
      if (depsFile) {
        return JSON.parse(depsFile);
      }
      return {};
    } catch (error) {
      logger.error('Parse deps.json error:', error);
      return {};
    }
  };

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

  // 编译策略相关处理函数
  const handleCompilerTypeChange = useCallback((type: CompilerType) => {
    setCompilerConfig(prev => ({
      ...prev,
      type
    }));
    logger.info('Compiler type changed to:', type);
  }, []);

  const handleCompilerOptionChange = useCallback((key: keyof CompilerOptions, value: any) => {
    setCompilerConfig(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value
      }
    }));
    logger.info('Compiler option changed:', key, value);
  }, []);

  const handleAutoFallbackChange = useCallback((enabled: boolean) => {
    setCompilerConfig(prev => ({
      ...prev,
      autoFallback: enabled
    }));
    logger.info('Auto fallback changed to:', enabled);
  }, []);

  // 获取当前要显示的文件（编辑模式使用编辑后的文件，否则使用原始文件）
  const getCurrentFiles = useCallback(() => {
    const files = editingMode ? editedFiles : getFiles();
    logger.debug('getCurrentFiles called:', {
      editingMode,
      selectedDemo: selectedDemo.key,
      filesKeys: Object.keys(files),
      filesHash: JSON.stringify(Object.keys(files).sort())
    });
    return files;
  }, [editingMode, editedFiles, selectedDemo.key, getFiles]);

  // 编译时间格式化
  const formatDuration = (duration: number): string => {
    if (duration < 1) {
      return `${(duration * 1000).toFixed(1)}ms`;
    }
    return `${duration.toFixed(3)}s`;
  };

  // 监听编译开始
  const handleCompilationStart = useCallback(() => {
    setIsCompiling(true);
    setCompilationTime(null);
  }, []);

  // 监听编译完成
  const handleCompilationComplete = useCallback((duration: number) => {
    setCompilationTime(duration);
    setIsCompiling(false);
  }, []);

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

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      {/* 左侧边栏 - Demo 选择器 */}
      <div className={`
        bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
      `}>
        {/* 侧边栏头部 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">示例列表</h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Demo 选择区域 */}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarCollapsed ? (
            // 收起状态：只显示图标
            <div className="space-y-2">
              {demoList.map((demo, index) => (
                <button
                  key={demo.key}
                  onClick={() => setSelectedDemo(demo)}
                  className={`
                    w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center
                    ${selectedDemo.key === demo.key
                      ? 'bg-blue-600 text-blue-500 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  title={demo.name}
                >
                  <span className="text-sm font-bold">{index + 1}</span>
                </button>
              ))}
            </div>
          ) : (
            // 展开状态：显示下拉选择器
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">选择示例</label>
                <select
                  value={selectedDemo.key}
                  onChange={(e) => {
                    const demo = demoList.find(d => d.key === e.target.value);
                    if (demo) {
                      setSelectedDemo(demo);
                    }
                  }}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {demoList.map((demo) => (
                    <option key={demo.key} value={demo.key}>
                      {demo.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 当前示例信息 */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{selectedDemo.name}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{selectedDemo.description}</p>
                <div className="mt-2 text-xs text-gray-500">
                  <div>入口文件: {selectedDemo.entryFile}</div>
                  <div>文件数量: {Object.keys(getFiles()).length}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 编译策略配置区域 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">编译策略配置</h3>
            <div className="space-y-3">
              {/* 编译器类型选择 */}
              <div>
                <label className="text-xs text-gray-700 block mb-1">编译器类型</label>
                <select
                  value={compilerConfig.type}
                  onChange={(e) => handleCompilerTypeChange(e.target.value as CompilerType)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="babel">Babel</option>
                  <option value="swc">SWC</option>
                </select>
              </div>

              {/* JSX 运行时选择 */}
              <div>
                <label className="text-xs text-gray-700 block mb-1">JSX 运行时</label>
                <select
                  value={compilerConfig.options?.jsx || 'react-jsx'}
                  onChange={(e) => handleCompilerOptionChange('jsx', e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="react-jsx">React JSX (自动)</option>
                  <option value="react">React JSX (经典)</option>
                  <option value="preserve">保持原样</option>
                </select>
              </div>

              {/* 目标环境 */}
              <div>
                <label className="text-xs text-gray-700 block mb-1">目标环境</label>
                <select
                  value={compilerConfig.options?.target || 'es2020'}
                  onChange={(e) => handleCompilerOptionChange('target', e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="es2015">ES2015</option>
                  <option value="es2016">ES2016</option>
                  <option value="es2017">ES2017</option>
                  <option value="es2018">ES2018</option>
                  <option value="es2019">ES2019</option>
                  <option value="es2020">ES2020</option>
                  <option value="es2021">ES2021</option>
                  <option value="es2022">ES2022</option>
                </select>
              </div>

              {/* 其他选项 */}
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compilerConfig.options?.typescript ?? true}
                    onChange={(e) => handleCompilerOptionChange('typescript', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-700">TypeScript 支持</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compilerConfig.options?.minify ?? false}
                    onChange={(e) => handleCompilerOptionChange('minify', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-700">代码压缩</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compilerConfig.options?.sourceMaps ?? false}
                    onChange={(e) => handleCompilerOptionChange('sourceMaps', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-700">源码映射</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compilerConfig.autoFallback ?? true}
                    onChange={(e) => handleAutoFallbackChange(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-xs text-gray-700">自动回退</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 日志配置区域 */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">日志配置</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loggerConfig.enabled}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-xs text-gray-700">启用日志</span>
              </label>
              <div>
                <label className="text-xs text-gray-700 block mb-1">日志级别</label>
                <select
                  value={loggerConfig.level}
                  onChange={(e) => setLoggerConfig(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
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
                  className="mr-2"
                />
                <span className="text-xs text-gray-700">显示时间戳</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedDemo.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{selectedDemo.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>入口文件: {selectedDemo.entryFile}</span>
                <span>编译器: {compilerConfig.type === 'babel' ? 'Babel' : 'SWC'}</span>
                <span>JSX: {compilerConfig.options?.jsx}</span>
                <span>目标: {compilerConfig.options?.target}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* 编译时间显示 - 右上角 */}
              <div className="flex items-center space-x-2">
                {isCompiling && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>编译中...</span>
                  </div>
                )}
                {compilationTime !== null && !isCompiling && (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                    <span className="font-medium">编译时间:</span>
                    <span className="ml-1 font-mono text-green-600">
                      {formatDuration(compilationTime)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditingMode(!editingMode)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${editingMode 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                {editingMode ? '退出编辑' : '实时编辑'}
              </button>
              {editingMode && (
                <button
                  onClick={handleResetFiles}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  重置
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1 flex">
          {/* 编辑区域 */}
          {editingMode && (
            <div className="w-1/2 bg-white border-r border-gray-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">文件编辑</h3>
              <div className="space-y-4">
                {Object.entries(getCurrentFiles()).map(([fileName, content]) => (
                  <div key={fileName}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{fileName}</h4>
                    <textarea
                      value={content}
                      onChange={(e) => handleFileEdit(fileName, e.target.value)}
                      className="w-full h-32 p-2 border border-gray-300 rounded text-xs font-mono resize-none"
                      placeholder="输入代码..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 预览区域 */}
          <div className={`${editingMode ? 'w-1/2' : 'w-full'} relative`}>
            <div className="absolute inset-0">
              {(() => {
                const currentFiles = getCurrentFiles();
                const currentDeps = getDeps();
                logger.debug('Rendering ReactPreviewer:', {
                  selectedDemo: selectedDemo.key,
                  files: Object.keys(currentFiles),
                  deps: Object.keys(currentDeps),
                  entryFile: selectedDemo.entryFile,
                  compilerConfig
                });
                return (
                  <ReactPreviewer
                    files={currentFiles}
                    depsInfo={currentDeps}
                    entryFile={selectedDemo.entryFile}
                    onElementClick={handleElementClick}
                    loggerConfig={loggerConfig as Partial<LoggerConfig>}
                    compilerConfig={compilerConfig}
                    onCompilationStart={handleCompilationStart}
                    onCompilationComplete={handleCompilationComplete}
                  />
                );
              })()}
            </div>
          </div>
        </div>

        {/* 依赖加载功能说明区域 */}
        {(selectedDemo.key === 'simpleReactDemo' || selectedDemo.key === 'dependencyLoadingDemo' || selectedDemo.key === 'arcoDesignDemo') && (
          <div className="bg-white border-t border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">依赖加载功能说明</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>观察要点:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>页面加载时应该显示依赖加载进度条</li>
                <li>进度条显示每个依赖的加载状态（等待中、加载中、已加载、加载失败）</li>
                <li>加载完成后进度条自动消失</li>
                <li>如果依赖加载失败，会显示错误状态</li>
              </ul>
              <p className="mt-2"><strong>当前依赖:</strong> {Object.keys(getDeps()).length > 0 ? Object.keys(getDeps()).join(', ') : '无外部依赖'}</p>
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
