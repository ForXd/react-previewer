import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'page',
  },
  // @ts-ignore
  base: process.env.IS_DEV ? '/' : 'https://fastly.jsdelivr.net/gh/ForXd/react-previewer@main/page'
})
