# React Previewer

面向组件编辑器、低代码平台和在线示例的 React 代码预览运行时。它在隔离 iframe 中编译并运行 TSX/JSX，支持多文件、本地 CSS、第三方 ESM 依赖、运行时错误、路由同步和源码定位。

`ReactPreviewer` 只负责预览能力。工具栏、设备尺寸、地址栏和产品视觉都由调用方组合，避免库组件替应用决定界面。

## 安装

```bash
npm install @zllling/react-previewer
```

```tsx
import { ReactPreviewer } from '@zllling/react-previewer';
import '@zllling/react-previewer/styles.css';
```

## 基本用法

```tsx
const files = {
  'App.tsx': `
import React from 'react';
import './styles.css';

export default function App() {
  return <div className="card">Hello React Previewer</div>;
}
  `,
  'styles.css': `
.card {
  padding: 24px;
  border-radius: 12px;
  background: white;
}
  `
};

export default function Page() {
  return <ReactPreviewer files={files} entryFile="App.tsx" />;
}
```

## 调用方自定义样式

根节点保留常规的 `className` / `style`，内部反馈层通过四个稳定 slot 开放：`root`、`loading`、`error`、`iframe`。

```tsx
<ReactPreviewer
  files={files}
  className="product-preview"
  classNames={{
    root: 'product-preview--paper',
    loading: 'product-preview__loading',
    error: 'product-preview__error',
    iframe: 'product-preview__iframe'
  }}
  styles={{
    root: {
      borderRadius: 18,
      boxShadow: '0 28px 80px rgba(29, 38, 56, 0.16)'
    },
    loading: { backdropFilter: 'blur(14px)' },
    iframe: { backgroundColor: '#f8fafc' }
  }}
/>
```

默认 loading 与 error 也可以替换内容，而不需要接触编译实现：

```tsx
<ReactPreviewer
  files={files}
  renderLoading={(status) => <Spinner label={status.phase} />}
  renderError={(error) => <ProductErrorState message={error.message} />}
/>
```

仓库 demo 进一步演示了由调用方实现 Monaco 多文件编辑、实时预览、设备框、地址栏、编译器切换、Paper/Ink 主题和源码检查面板。

- 示例可以搜索；切换场景会保留各自草稿，重置只作用于当前示例。草稿仅保留在当前页面会话中。
- 编辑器和预览使用页签切换，支持方向键、Home / End；选择设备尺寸或检查元素会打开预览。
- 检查面板可以直接打开对应源文件并选中代码范围；底部状态栏展示真实编译状态与耗时。
- Paper / Ink 统一工作台与编辑器主题，iframe 内的业务界面仍由示例代码定义。

## 依赖与 CSS

`depsInfo` 声明 iframe 内的第三方 ESM 依赖。React 与 React DOM 默认使用 19.2.8；指定 `depsInfo.react` 时 React DOM 与 JSX runtime 会跟随该版本，其他依赖应显式声明：

```tsx
<ReactPreviewer
  files={files}
  depsInfo={{
    '@arco-design/web-react': '2.66.16'
  }}
/>
```

本地 CSS import 会编译为 iframe 内样式；包 CSS 和远程 CSS 会进入资源加载生命周期。

```tsx
<ReactPreviewer
  files={files}
  depsInfo={{ antd: '6.6.2' }}
  dependencyStyles={{
    antd: 'https://esm.sh/antd@6.6.2/dist/reset.css'
  }}
/>
```

需要在 iframe 中使用 Tailwind Browser 时显式启用，避免普通预览无条件下载额外 CDN 脚本：

```tsx
<ReactPreviewer files={files} enableTailwind />
```

## 检查模式与路由

检查模式是受控状态。调用方决定何时开启，并负责展示点击结果：

```tsx
<ReactPreviewer
  files={files}
  isInspecting={isInspecting}
  onElementClick={(sourceInfo) => setSelectedSource(sourceInfo)}
  initialPath="/projects/42"
  onRouteChange={(route) => setAddressValue(route.href)}
/>
```

## 编译器

默认使用 Babel。编译任务按预览实例串行执行，连续修改只采用最新结果；过期结果和卸载后的资源会被释放。自定义编译 adapter 或 `workerFactory` 建议保持稳定引用，需要更换实现时传入新实例。

Rspack Browser 适合更接近 bundler 的浏览器编译路径：

```tsx
<ReactPreviewer
  files={files}
  compiler={{
    type: 'rspack-browser',
    rspack: {
      cdnDomain: 'https://esm.sh',
      workerFactory: () => new Worker(workerUrl, { type: 'module' })
    }
  }}
/>
```

`@rspack/browser` 依赖 `SharedArrayBuffer`，承载页面必须启用 cross-origin isolation：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

静态站点可使用等效的 cross-origin isolation service worker。仓库 demo 已配置对应脚本。

## 错误与源码位置

默认错误界面区分三类 `ErrorInfo.type`：

- `compile`：语法或编译失败，展示文件、行列和 compiler code frame。
- `dependency`：相对文件、未声明包、ESM 或 CSS 资源无法解析或加载，展示依赖名与请求 URL（若可用）。
- `runtime`：代码运行或 React 渲染期间抛错，展示映射回用户文件的行列和可展开堆栈。

Babel 输出保留源码行号；Rspack Browser 输出 source map，运行时 bundle 堆栈会映射回原始文件。行列均按用户可读的一基坐标展示。

调用方可以通过 `renderError` 替换界面，也可以从 `onError` 的第二个参数读取结构化信息：

```tsx
<ReactPreviewer
  files={files}
  onError={(error, info) => {
    reportPreviewFailure({ error, type: info.type, file: info.fileName });
  }}
/>
```

仓库 demo 提供编译错误、依赖错误和运行时错误三个可编辑示例；修复 Monaco 中的代码后会自动重新编译并恢复预览。

## Props

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `files` | 必填 | 文件名到源代码的映射 |
| `entryFile` | `App.tsx` | 入口文件 |
| `depsInfo` | `{}` | 第三方依赖版本 |
| `dependencyStyles` | `{}` | 依赖对应的 CSS URL |
| `compiler` | `babel` | Babel、Rspack Browser 或自定义编译 adapter |
| `compileDelay` | `120` | 文件变化后的编译去抖毫秒数 |
| `enableTailwind` | `false` | 是否加载 Tailwind Browser runtime |
| `initialPath` | `/` | iframe 的 pathname、query 和 hash |
| `isInspecting` | `false` | 是否启用元素源码定位 |
| `className` / `style` | - | 根节点样式 |
| `classNames` / `styles` | - | `root`、`loading`、`error`、`iframe` slot 样式 |
| `renderLoading` | - | 自定义 loading 内容 |
| `renderError` | - | 自定义错误内容 |
| `iframeTitle` | `React preview` | iframe 可访问名称 |
| `onStatusChange` | - | 编译与资源加载状态 |
| `onError` | - | 编译、依赖或运行错误；第二参数为结构化 `ErrorInfo` |
| `onElementClick` | - | 检查模式下的源码位置 |
| `onRouteChange` | - | iframe 路由变化 |
| `loggerConfig` | 禁用 | 可选诊断日志配置 |

完整类型由包入口导出，包括 `ReactPreviewerProps`、`ReactPreviewerClassNames`、`ReactPreviewerStyles`、`PreviewStatus`、`PreviewErrorType`、`ErrorInfo`、`SourceInfo` 与编译器类型。

## 从旧版迁移

内置工作台 UI 已移出库组件：

- 删除 `showToolbar`、`defaultViewport`、`defaultZoom`。
- 用调用方布局控制设备尺寸和缩放。
- 用受控 `isInspecting` 替代工具栏内部检查状态。
- 内部的 `PreviewFrame`、工具栏、错误组件和编译实现不再从包入口导出。

这样公共 interface 更小，内部重构不会迫使调用方同步修改。

## 开发与验证

使用 `.node-version` 指定的 Node 24.15.0，支持的最低环境为 Node 22.18 / 24.11。宿主支持 React 18 / 19；TypeScript 7 负责类型检查，类型声明和 ESLint 使用官方 TypeScript 6 兼容包。完整版本与迁移决策见 [DEPENDENCIES.md](./DEPENDENCIES.md)。

```bash
npm ci
npm run dev
npm test
npm run lint
npm run build:lib
npm run build:page
npm run test:package
```

GitHub Pages 只部署提交到仓库的 `page/`。`dist/` 是 npm 组件库产物，已从 Git 跟踪中移除；本地构建及 `npm publish` 的 `prepublishOnly` 会生成它，npm 包仍包含 `dist/`。

架构说明见 [DESIGN.md](./DESIGN.md)。

## 发布到 npm

npm 包关联 GitHub 仓库 `ForXd/react-previewer`，使用 `npm-publish.yml` 的 OIDC Trusted Publisher。无需在工作流内保存 npm 发布 token；每次发布都运行测试、构建、安全审计和 ESM / CommonJS 产物检查，并生成来源证明及 GitHub Release。

更新版本与锁文件、构建并提交 `page/` 后，**合并到 `main` 即自动检查并发布 npm 上不存在的新版本**。同一版本的后续合并会跳过重复发包；registry 请求失败时会停止，不会误判成新版本。发布成功后自动创建对应 tag 和 GitHub Release。

也支持手动推送匹配版本的 tag，或在 Actions 中手动重试。例如，版本为 `0.1.0` 时使用 `v0.1.0`；工作流会拒绝 tag 与 `package.json` 版本不一致的发布。

```bash
git tag v0.1.0
git push origin v0.1.0
```

npm Trusted Publisher 的配置为：GitHub 用户 `ForXd`、仓库 `react-previewer`、工作流文件 `npm-publish.yml`，允许直接 `npm publish`。配置方式见 [npm 官方说明](https://docs.npmjs.com/trusted-publishers/)。

## License

MIT
