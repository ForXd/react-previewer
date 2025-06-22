/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/lib/ReactPreview/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // 确保只生成组件库需要的样式
  corePlugins: {
    preflight: false, // 避免重置全局样式
  },
} 