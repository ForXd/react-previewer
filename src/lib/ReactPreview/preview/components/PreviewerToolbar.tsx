// components/PreviewerToolbar.tsx
import React from 'react';

interface PreviewerToolbarProps {
  isLoading: boolean;
  isInspecting: boolean;
  onRecompile: () => void;
  onToggleInspect: () => void;
}

export const PreviewerToolbar: React.FC<PreviewerToolbarProps> = ({
  isLoading,
  isInspecting,
  onRecompile,
  onToggleInspect,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* 重新编译按钮 */}
        <button
          onClick={onRecompile}
          disabled={isLoading}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 ease-in-out
            ${isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md'
            }
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              编译中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </>
          )}
        </button>
        
        {/* 检查元素按钮 */}
        <button
          onClick={onToggleInspect}
          className={`
            inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200 ease-in-out border
            ${isInspecting
              ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
            }
          `}
        >
          {isInspecting ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              退出
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              检查
            </>
          )}
        </button>
      </div>

      {/* 右侧提示信息 */}
      <div className="flex items-center space-x-4">
        {isInspecting && (
          <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="whitespace-nowrap">点击带有源码信息的元素查看详情</span>
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
            <svg className="animate-spin w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在编译预览...</span>
          </div>
        )}
      </div>
    </div>
  );
};