import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const crossOriginIsolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  cacheDir: loadEnv(mode, '.', '').AI_PREVIEW_ONLY
    ? 'node_modules/.vite-ai-preview'
    : 'node_modules/.vite',
  server: {
    headers: crossOriginIsolationHeaders,
    proxy: loadEnv(mode, '.', '').AI_PREVIEW_ONLY
      ? undefined
      : { '/api': 'http://127.0.0.1:8787' }
  },
  preview: {
    headers: crossOriginIsolationHeaders
  },
  worker: {
    format: 'es'
  },
  build: {
    outDir: 'page',
    rollupOptions: {
      input: { main: 'index.html', aiPreview: 'ai-preview.html' }
    }
  },
  base: command === 'serve' ? '/' : './'
}));
