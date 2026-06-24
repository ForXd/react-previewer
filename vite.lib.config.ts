import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/lib/ReactPreview/**/*'],
      exclude: ['src/lib/ReactPreview/test/**/*'],
      outDir: 'dist',
      tsconfigPath: './tsconfig.lib.json',
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/lib/ReactPreview/index.ts',
        'rspack-browser-worker': 'src/lib/ReactPreview/preview/compilers/rspackBrowser.worker.ts',
      },
      name: 'ReactPreviewer',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${extension}`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', '@rspack/browser'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOM',
          '@rspack/browser': 'RspackBrowser',
        },
      },
    },
    sourcemap: true,
    minify: false, // 保持代码可读性
    target: 'es2020',
    outDir: 'dist',
  },
}) 
