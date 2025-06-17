// components/SourceTooltip.tsx (修复版本)
import React, { useEffect, useRef } from 'react';
import type { SourceInfo } from '../types';

interface SourceTooltipProps {
  sourceInfo: SourceInfo;
  onClose: () => void;
}

export const SourceTooltip: React.FC<SourceTooltipProps> = ({ sourceInfo, onClose }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    const tooltipWidth = 500;
    const tooltipHeight = 300;
    const padding = 20;
    
    let left = sourceInfo.position.x + 10;
    let top = sourceInfo.position.y + 10;
    
    if (left + tooltipWidth > window.innerWidth - padding) {
      left = sourceInfo.position.x - tooltipWidth - 10;
    }
    
    if (top + tooltipHeight > window.innerHeight - padding) {
      top = sourceInfo.position.y - tooltipHeight - 10;
    }
    
    left = Math.max(padding, left);
    top = Math.max(padding, top);
    
    return { left, top };
  };

  const { left, top } = calculatePosition();

  // 防止点击事件冒泡
  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // 防止遮罩层点击事件冒泡
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  useEffect(() => {
    console.log('SourceTooltip mounted with:', sourceInfo);
    return () => {
      console.log('SourceTooltip unmounted');
    };
  }, [sourceInfo]);

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-10 z-[9999]"
        onClick={handleOverlayClick}
      />
      
      {/* 源码浮窗 */}
      <div
        ref={tooltipRef}
        className="fixed bg-gray-800 text-gray-200 p-4 rounded-lg text-xs font-mono shadow-2xl z-[10000] max-w-[500px] max-h-[300px] border border-gray-600 overflow-auto"
        style={{ left: `${left}px`, top: `${top}px` }}
        onClick={handleTooltipClick}
      >
        {/* 头部 */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-600">
          <div className="font-bold text-blue-300 text-sm">
            {sourceInfo.file}:{sourceInfo.startLine}-{sourceInfo.endLine}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="bg-transparent border-none text-gray-400 cursor-pointer text-base p-0 w-5 h-5 flex items-center justify-center hover:text-white transition-colors"
            title="关闭"
          >
            ×
          </button>
        </div>
        
        {/* 代码内容 */}
        <pre className="m-0 whitespace-pre-wrap leading-6 text-xs">
          {sourceInfo.content}
        </pre>
      </div>
    </>
  );
};