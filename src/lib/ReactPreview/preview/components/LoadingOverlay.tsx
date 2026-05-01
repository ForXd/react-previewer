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
      <div className="w-[min(360px,calc(100%-32px))] rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="relative">
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
        </div>
        <div className="mt-4 text-sm font-semibold text-slate-900">{phaseText[status.phase]}</div>
        <div className="mt-1 text-xs text-slate-500">
          {showProgress
            ? `${status.resourceLoaded}/${status.resourceTotal} resources`
            : '请稍候，正在处理您的代码'}
        </div>
        {showProgress && (
          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-[width] duration-200"
                style={{ width: `${status.resourceProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xs tabular-nums text-slate-500">{status.resourceProgress}%</div>
          </div>
        )}
      </div>
    </div>
  );
};
