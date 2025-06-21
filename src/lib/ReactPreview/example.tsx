import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ReactPreviewer } from './preview/ReactPreviewer';
import { SourceTooltip } from './preview/components/SourceTooltip';
import { demoList } from './test/demo';
import type { SourceInfo } from './preview/types';

const ExampleUsage: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState(demoList[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastClickedElement, setLastClickedElement] = useState<SourceInfo | null>(null);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [editedFiles, setEditedFiles] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // 初始化编辑文件
  useEffect(() => {
    const files = getFiles();
    setEditedFiles(files);
  }, [selectedDemo]);

  const getFiles = () => {
    const files = { ...selectedDemo.files };
    const filesWithDeps = files as Record<string, string>;
    if ('deps.json' in filesWithDeps) {
      delete filesWithDeps['deps.json'];
    }
    return filesWithDeps;
  };

  const getDeps = () => {
    try {
      const filesWithDeps = selectedDemo.files as Record<string, string>;
      const depsFile = filesWithDeps['deps.json'];
      if (depsFile) {
        return JSON.parse(depsFile);
      }
      return {};
    } catch (error) {
      console.error('Parse deps.json error:', error);
      return {};
    }
  };

  const handleElementClick = (sourceInfo: SourceInfo) => {
    console.log('Element clicked in example:', sourceInfo);
    setLastClickedElement(sourceInfo);
    setSourceInfo(sourceInfo);
  };

  const handleCloseSourceTooltip = () => {
    console.log('Closing source tooltip from example');
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
  }, [selectedDemo]);

  // 点击外部区域关闭浮窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceInfo && !event.defaultPrevented) {
        console.log('Closing source info due to outside click');
        setSourceInfo(null);
      }
    };

    if (sourceInfo) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sourceInfo]);

  // 获取当前要显示的文件（编辑模式使用编辑后的文件，否则使用原始文件）
  const getCurrentFiles = () => {
    return editingMode ? editedFiles : getFiles();
  };

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

        {/* Demo 列表 */}
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
            // 展开状态：显示完整信息
            <div className="space-y-3">
              {demoList.map((demo) => (
                <button
                  key={demo.key}
                  onClick={() => setSelectedDemo(demo)}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200
                    ${selectedDemo.key === demo.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="font-semibold text-sm mb-1">{demo.name}</div>
                  <div className="text-xs opacity-75 leading-relaxed">{demo.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedDemo.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{selectedDemo.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                入口文件: {selectedDemo.entryFile}
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
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">代码编辑器</h3>
              </div>
              <div className="flex-1 overflow-auto">
                {Object.keys(editedFiles).map((fileName) => (
                  <div key={fileName} className="border-b border-gray-200">
                    <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                      {fileName}
                    </div>
                    <textarea
                      value={editedFiles[fileName]}
                      onChange={(e) => handleFileEdit(fileName, e.target.value)}
                      className="w-full h-64 p-4 text-sm font-mono bg-white border-none outline-none resize-none"
                      placeholder="在这里编辑代码..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 预览区域 */}
          <div className={`${editingMode ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <div className="flex-1 p-6 relative">
              <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <ReactPreviewer
                  files={getCurrentFiles()}
                  depsInfo={getDeps()}
                  entryFile={selectedDemo.entryFile}
                  onError={(error) => console.error('Preview error:', error)}
                  onElementClick={handleElementClick}
                />
              </div>
              
              {/* 外层控制的 SourceTooltip */}
              {sourceInfo && (
                <SourceTooltip
                  sourceInfo={sourceInfo}
                  containerElement={containerRef.current || document.body}
                  onClose={handleCloseSourceTooltip}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
