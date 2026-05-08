// components/SourceTooltip.tsx (修复版本)
import React, { useEffect, useRef } from 'react';
import type { SourceInfo } from '../types';
import { createModuleLogger } from '../utils/Logger';

const logger = createModuleLogger('SourceTooltip');

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
    logger.debug('SourceTooltip mounted with:', sourceInfo);

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      logger.debug('SourceTooltip unmounted');
    };
  }, [sourceInfo, onClose]);

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
        className="pointer-events-auto fixed z-[10001] max-h-[300px] max-w-[500px] overflow-auto rounded-lg bg-white p-4 font-mono text-xs text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)]"
        style={{ left: `${left}px`, top: `${top}px` }}
        onClick={handleTooltipClick}
      >
        {/* 头部 */}
        <div className="mb-3 flex items-center justify-between border-b border-[#ebebeb] pb-2">
          <div className="text-sm font-semibold text-[#0070f3]">
            {sourceInfo.file}:{sourceInfo.startLine}-{sourceInfo.endLine}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex h-5 w-5 cursor-pointer items-center justify-center rounded bg-transparent p-0 text-base text-[#666666] transition-colors hover:bg-[#fafafa] hover:text-[#171717]"
            title="关闭"
          >
            ×
          </button>
        </div>
        
        {/* 代码内容 */}
        <div className="flex overflow-auto rounded-md bg-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
          {/* 行号列 */}
          <div className="select-none border-r border-white/10 bg-black px-2 py-2 text-right text-[#808080]">
            {Array.from({ length: sourceInfo.endLine - sourceInfo.startLine + 1 }, (_, i) => (
              <div key={i} className="leading-6 h-6">{sourceInfo.startLine + i}</div>
            ))}
          </div>
          {/* 代码内容列 */}
          <pre className="m-0 min-w-[60px] bg-transparent px-3 py-2 font-mono text-xs leading-6 whitespace-pre text-[#fafafa]">
            {sourceInfo.content}
          </pre>
        </div>
      </div>
    </>
  );
};
