# 依赖与升级记录

2026-09-05 按 npm 官方 registry 的 `latest` 标签核对稳定版本，锁定结果见 `package-lock.json`。库运行时、示例 UI、构建与测试工具分别管理；示例依赖不进入库的公共接口。

| 职责 | 依赖 | 本次稳定版本 |
| --- | --- | --- |
| AST 与浏览器转译 | `@babel/parser`、`@babel/standalone`、`@babel/types` | 8.0.4 |
| 浏览器打包 | `@rspack/browser` | 2.2.2 |
| Source map | `@jridgewell/trace-mapping` | 0.3.31（已是最新） |
| SWC 运行辅助 | `@swc/helpers` | 0.5.23（已是最新） |
| 宿主示例与默认 iframe | `react`、`react-dom` | 19.2.8 |
| 编辑器 | `monaco-editor` / `@monaco-editor/react` | 0.56.0 / 4.7.0（包装器已是最新） |
| 构建 | `vite` / `@vitejs/plugin-react` / `vite-plugin-dts` | 8.2.2 / 6.1.1 / 5.1.0 |
| 类型检查 | TypeScript CLI / 兼容工具 API | 7.0.2 / 6.0.2，说明见下文 |
| 代码规范 | `eslint` / `@eslint/js` / `typescript-eslint` | 10.10.0 / 10.0.1 / 8.69.0 |
| React 规范 | `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` | 7.1.1 / 0.5.6 |
| 环境声明 | `globals` | 17.12.0 |
| 测试 | `vitest` / `jsdom` / `@testing-library/react` | 5.0.0 / 30.0.1 / 16.3.3 |
| 类型声明 | `@types/react` / `@types/react-dom` | 19.2.18 / 19.2.7 |
| Babel 类型声明 | `@types/babel__standalone` | 7.1.9（已是最新） |
| CDN 示例及样式 | Arco Design / Ant Design / Tailwind browser | 2.66.16 / 6.6.2 / 4.3.3 |

## 兼容性决策

- **Node**：Babel 8 要求 `^22.18.0 || >=24.11.0`；仓库和 CI 用 `.node-version` 固定 Node 24.15.0。升级前使用 Node 20 的发布流水线同步调整。[Babel 8 迁移说明](https://babeljs.io/docs/v8-migration)
- **TypeScript**：使用官方并行安装方式，`@typescript/native` 指向稳定版 TypeScript 7，提供 `tsc`；`typescript` 指向稳定的 `@typescript/typescript6`，给类型声明生成和 ESLint 提供兼容的旧 API。没有绕过 peer 检查或使用预发布版本。待这些工具支持 TypeScript 7 API 后再删除兼容包。[TypeScript 7 官方说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
- **React**：宿主 peer 保留 React 18，并增加 React 19。库构建 external 掉 React、React DOM 及其全部子路径，防止打包的 JSX runtime 与使用方版本混用。默认 iframe 升为 React 19.2.8；通过 `depsInfo` 指定 React 18 时，React DOM、client、JSX runtime 同步跟随。显式子路径覆盖仍保留。
- **错误处理**：React 19 的渲染异常通过 `createRoot({ onUncaughtError })` 上报；React 18 继续使用原有 window 错误监听。Babel 8 使用显式 automatic JSX runtime 和生产转换配置；保留 JSX 的源码标记转换改用 `ignoreExtensions` + `syntax-jsx`。[React 19 迁移说明](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)、[Babel 8 API 迁移说明](https://babeljs.io/docs/v8-migration-api)
- **Monaco**：使用 0.56 的公开导出路径，分别注册 JS / TS / CSS 语法及语言服务，worker 保持本地加载。移除手写 TypeScript API 类型替身。
- **安全修复**：Monaco 0.56.0 固定了有公开漏洞的 DOMPurify 3.4.8，因此用仅针对 Monaco 的 `overrides` 升至 3.4.14；此次官方 registry 审计为 0 个漏洞。上游更新约束后可以移除 override。

## 验证方式

```bash
npm ci
npm test
npm run lint
npm run build
npm run build:lib
npm run build:page
npm run test:package
npm audit --registry=https://registry.npmjs.org
```

`test:package` 检查生成后的 ESM / CommonJS 入口能使用宿主 React 渲染。`Validate` 流水线先验证锁文件中的 React 19，再临时安装 React 18.3.1 运行同一套测试和产物检查。本地切换 React 18 后使用 `npm ci` 恢复锁文件环境，再构建并验证 `dist/`、提交 `page/`。`dist/` 只用于 npm 包，保持 Git 忽略；GitHub Pages 部署仅上传 `page/`。

浏览器回归覆盖 Monaco 编辑、Babel / Rspack 多文件编译、React 19 渲染异常与修复、Arco 组件及远程 CSS、路由同步、检查元素与源码定位、主题和移动端布局。自动测试不依赖公共 CDN；浏览器示例运行仍需要 CDN 网络可达。
