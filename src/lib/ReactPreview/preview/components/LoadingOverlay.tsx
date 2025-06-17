// components/LoadingOverlay.tsx
import React from 'react';

export const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-[1000]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-gray-600 font-medium">正在编译预览...</div>
        <div className="text-sm text-gray-500">请稍候，正在处理您的代码</div>
      </div>
    </div>
  );
};