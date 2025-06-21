// components/SourceTooltip.tsx (修复版本)
import React, { useEffect, useRef } from 'react';
import type { SourceInfo } from '../types';

interface SourceTooltipProps {
  sourceInfo: SourceInfo;
  containerElement: HTMLElement;
  onClose: () => void;
}

export const SourceTooltip: React.FC<SourceTooltipProps> = ({ sourceInfo, containerElement, onClose }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    const tooltipWidth = 500;
    const tooltipHeight = 300;
    const padding = 20;
    
    // 获取容器的位置和尺寸
    const containerRect = containerElement.getBoundingClientRect();
    
    // 计算相对于容器的位置
    let left = sourceInfo.position.x - containerRect.left + 10;
    let top = sourceInfo.position.y - containerRect.top + 10;
    
    // 检查是否超出容器右边界
    if (left + tooltipWidth > containerRect.width - padding) {
      left = sourceInfo.position.x - containerRect.left - tooltipWidth - 10;
    }
    
    // 检查是否超出容器下边界
    if (top + tooltipHeight > containerRect.height - padding) {
      top = sourceInfo.position.y - containerRect.top - tooltipHeight - 10;
    }
    
    // 确保不超出容器左边界和上边界
    left = Math.max(padding, left);
    top = Math.max(padding, top);
    
    // 转换为相对于视口的位置
    return { 
      left: left + containerRect.left, 
      top: top + containerRect.top 
    };
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
        className="fixed inset-0 bg-transparent z-[9999]"
        onClick={handleOverlayClick}
      />
      
      {/* 源码浮窗 */}
      <div
        ref={tooltipRef}
        className="fixed bg-gray-800 text-gray-200 p-4 rounded-lg text-xs font-mono shadow-2xl z-[10001] max-w-[500px] max-h-[300px] border border-gray-600 overflow-auto pointer-events-auto"
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
        <div className="flex bg-[#23272e] rounded-md overflow-auto border border-gray-700">
          {/* 行号列 */}
          <div className="py-2 px-2 text-right select-none bg-[#20232a] text-gray-500 border-r border-gray-700">
            {Array.from({ length: sourceInfo.endLine - sourceInfo.startLine + 1 }, (_, i) => (
              <div key={i} className="leading-6 h-6">{sourceInfo.startLine + i}</div>
            ))}
          </div>
          {/* 代码内容列 */}
          <pre className="py-2 px-3 m-0 whitespace-pre leading-6 text-xs text-gray-100 bg-transparent font-mono min-w-[60px]">
            {sourceInfo.content}
          </pre>
        </div>
      </div>
    </>
  );
};