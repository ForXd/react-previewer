import React, { useState } from 'react';
import { ReactPreviewer } from './preview/ReactPreviewer';
import { demoList } from './test/demo';

const ExampleUsage: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState(demoList[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
                      ? 'bg-blue-600 text-white shadow-md'
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

      {/* 右侧预览区域 */}
      <div className="flex-1 flex flex-col">
        {/* 预览内容区域 */}
        <div className="flex-1 p-6">
          <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <ReactPreviewer
              files={getFiles()}
              depsInfo={getDeps()}
              entryFile={selectedDemo.entryFile}
              onError={(error) => console.error('Preview error:', error)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
