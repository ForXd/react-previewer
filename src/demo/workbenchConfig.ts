import type { PreviewCompilerLike, PreviewStatus } from '../lib/ReactPreview';
import rspackBrowserWorkerUrl from '../lib/ReactPreview/preview/compilers/rspackBrowser.worker.ts?worker&url';

export type CompilerMode = 'babel' | 'rspack-browser';
export type PreviewSkin = 'paper' | 'ink';
export type ViewportName = 'responsive' | 'tablet' | 'mobile';
export type WorkbenchView = 'editor' | 'preview';

export const viewports = {
  responsive: { label: '响应式', width: '100%' },
  tablet: { label: '平板', width: 820 },
  mobile: { label: '手机', width: 390 }
} as const;

export const compilers: Record<CompilerMode, PreviewCompilerLike> = {
  babel: 'babel',
  'rspack-browser': {
    type: 'rspack-browser',
    rspack: {
      cdnDomain: 'https://esm.sh',
      workerFactory: () =>
        new Worker(new URL(rspackBrowserWorkerUrl, import.meta.url), {
          type: 'module',
          name: 'react-previewer-demo-rspack-browser'
        })
    }
  }
};

export const statusLabels: Record<PreviewStatus['phase'], string> = {
  idle: '等待编译',
  compiling: '正在编译',
  'loading-js': '加载依赖',
  'loading-css': '加载样式',
  rendering: '正在渲染',
  ready: '预览已就绪',
  error: '预览出错'
};
