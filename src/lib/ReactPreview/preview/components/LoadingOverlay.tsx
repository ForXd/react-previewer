// components/LoadingOverlay.tsx
import React from 'react';
import type { PreviewStatus } from '../types';

const phaseText: Record<PreviewStatus['phase'], string> = {
  idle: '准备预览...',
  compiling: '正在编译预览...',
  'loading-js': '正在加载依赖...',
  'loading-css': '正在加载样式...',
  rendering: '正在渲染组件...',
  ready: '预览已就绪',
  error: '预览失败'
};

interface LoadingOverlayProps {
  status: PreviewStatus;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ status }) => {
  const showProgress = status.resourceTotal > 0 && status.phase !== 'compiling';

  return (
    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="w-[min(360px,calc(100%-32px))] rounded-lg bg-white p-6 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_2px_2px_rgba(0,0,0,0.04),0_8px_8px_-8px_rgba(0,0,0,0.04)]">
        <div className="relative">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#ebebeb] border-t-[#171717]" />
        </div>
        <div className="mt-4 text-sm font-semibold text-[#171717]">{phaseText[status.phase]}</div>
        <div className="mt-1 text-xs text-[#666666]">
          {showProgress
            ? `${status.resourceLoaded}/${status.resourceTotal} resources`
            : '请稍候，正在处理您的代码'}
        </div>
        {showProgress && status.currentResource && (
          <div className="mt-2 truncate rounded-md bg-[#fafafa] px-3 py-2 text-xs text-[#666666] shadow-[0_0_0_1px_#ebebeb]">
            {status.currentResource}
          </div>
        )}
        {showProgress && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#ebebeb]">
              <div
                className="h-full rounded-full bg-[#171717] transition-[width] duration-200"
                style={{ width: `${status.resourceProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xs tabular-nums text-[#666666]">{status.resourceProgress}%</div>
          </div>
        )}
      </div>
    </div>
  );
};
