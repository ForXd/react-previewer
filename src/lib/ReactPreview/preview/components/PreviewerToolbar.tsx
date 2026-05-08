import React from 'react';
import type { PreviewStatus, PreviewViewport } from '../types';

interface PreviewerToolbarProps {
  isLoading: boolean;
  isInspecting: boolean;
  status: PreviewStatus;
  viewport: PreviewViewport;
  viewportPresets: PreviewViewport[];
  zoom: number;
  onRecompile: () => void;
  onToggleInspect: () => void;
  onViewportChange: (viewport: PreviewViewport) => void;
  onZoomChange: (zoom: number) => void;
}

const phaseLabel: Record<PreviewStatus['phase'], string> = {
  idle: 'Idle',
  compiling: 'Compiling',
  'loading-js': 'Loading JS',
  'loading-css': 'Loading CSS',
  rendering: 'Rendering',
  ready: 'Ready',
  error: 'Error'
};

export const PreviewerToolbar: React.FC<PreviewerToolbarProps> = ({
  isLoading,
  isInspecting,
  status,
  viewport,
  viewportPresets,
  zoom,
  onRecompile,
  onToggleInspect,
  onViewportChange,
  onZoomChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebebeb] bg-white px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onRecompile}
          disabled={isLoading}
          title="重新编译"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors duration-150 ${
            isLoading
              ? 'cursor-not-allowed bg-[#fafafa] text-[#808080] shadow-[0_0_0_1px_#ebebeb]'
              : 'bg-[#171717] text-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)] hover:bg-black active:bg-[#171717]'
          }`}
        >
          {isLoading ? (
            <svg className="h-4 w-4 animate-spin text-[#808080]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>

        <button
          onClick={onToggleInspect}
          title={isInspecting ? '关闭源码检查' : '打开源码检查'}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors duration-150 ${
            isInspecting
              ? 'bg-[#ebf5ff] text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.18)] hover:bg-[#e0f0ff]'
              : 'bg-white text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb] hover:bg-[#fafafa] hover:text-[#171717]'
          }`}
        >
          {isInspecting ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>

        <div className="flex h-9 items-center rounded-md bg-[#fafafa] p-0.5 shadow-[0_0_0_1px_#ebebeb]">
          {viewportPresets.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onViewportChange(item)}
              className={`h-8 px-3 text-xs font-medium transition-colors ${
                viewport.label === item.label
                  ? 'rounded bg-white text-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'
                  : 'text-[#666666] hover:text-[#171717]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <label className="flex h-9 items-center gap-2 rounded-md bg-white px-3 text-xs font-medium text-[#666666] shadow-[0_0_0_1px_#ebebeb]">
          <svg className="h-4 w-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10.5 7.5v6m-3-3h6m4 0a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            aria-label="缩放"
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-24 accent-[#171717]"
          />
          <span className="w-10 text-right tabular-nums">{Math.round(zoom * 100)}%</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isLoading && (
          <div className="flex items-center gap-2 rounded-md bg-[#fafafa] px-3 py-1.5 text-sm text-[#4d4d4d] shadow-[0_0_0_1px_#ebebeb]">
            <svg className="h-4 w-4 animate-spin flex-shrink-0 text-[#666666]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{phaseLabel[status.phase]}</span>
            {status.resourceTotal > 0 && (
              <span className="tabular-nums text-[#666666]">{status.resourceProgress}%</span>
            )}
          </div>
        )}

        {!isLoading && status.compileDuration !== null && !status.error && (
          <div className="flex items-center rounded-md bg-[#ebf5ff] px-3 py-1.5 text-sm text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.16)]">
            <span className="font-medium">{status.transformedFiles} files</span>
            <span className="mx-2 text-[#8cc7ff]">/</span>
            <span>{status.compileDuration}ms</span>
          </div>
        )}

        {status.error && (
          <div className="flex items-center rounded-md bg-[#fff1f0] px-3 py-1.5 text-sm text-[#c73a31] shadow-[0_0_0_1px_rgba(255,91,79,0.22)]">
            <span>编译失败</span>
          </div>
        )}

        {isInspecting && (
          <div className="flex items-center rounded-md bg-[#ebf5ff] px-3 py-1.5 text-sm text-[#0068d6] shadow-[0_0_0_1px_rgba(0,112,243,0.16)]">
            <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="whitespace-nowrap">点击元素查看源码</span>
          </div>
        )}
      </div>
    </div>
  );
};
