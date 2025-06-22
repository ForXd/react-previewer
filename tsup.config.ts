import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/ReactPreview/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: false, // 保持代码可读性
  target: 'es2020',
  outDir: 'dist',
  onSuccess: 'echo "Build completed successfully!"',
}); 