# React Previewer

[![npm version](https://img.shields.io/npm/v/@zllling/react-previewer)](https://www.npmjs.com/package/@zllling/react-previewer)
[![CI](https://github.com/ForXd/react-previewer/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ForXd/react-previewer/actions/workflows/npm-publish.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ForXd/react-previewer/blob/main/LICENSE)

在 React 应用中嵌入可实时更新的代码预览。

React Previewer 在浏览器中编译 TSX / JSX，并在 iframe 内渲染结果，适用于组件文档、在线编辑器、交互式教程和低代码平台。通过文件映射和少量配置即可接入，也可以扩展编译器、状态反馈和界面样式。

**[在线体验](https://forxd.github.io/react-previewer/)** · [npm](https://www.npmjs.com/package/@zllling/react-previewer) · [版本发布](https://github.com/ForXd/react-previewer/releases) · [反馈问题](https://github.com/ForXd/react-previewer/issues)

## 特性

- **多文件预览**：支持 TSX / JSX、相对路径导入和本地 CSS，修改文件后自动重新编译。
- **浏览器编译**：内置 Babel 和 Rspack Browser，支持接入自定义编译器。
- **依赖加载**：声明第三方 ESM 依赖及样式资源，可选启用 Tailwind Browser。
- **状态与错误反馈**：提供编译和资源加载进度，以及编译、依赖和运行时错误信息。
- **源码定位与路由同步**：检查预览中的元素以获取源码位置，通过回调同步 iframe 路由。
- **界面定制**：提供样式插槽与加载、错误渲染接口，可与宿主应用的设计系统组合。

库组件提供预览区域；编辑器、工具栏、设备尺寸和主题由应用组合。[在线示例](https://forxd.github.io/react-previewer/) 展示了基于 Monaco 的多文件编辑、设备预览、编译器切换、明暗主题和源码检查。

## 安装

在已有的 React 项目中安装：

```bash
npm install @zllling/react-previewer
```

支持 React / React DOM 18.2+ 或 19.x，提供 ESM、CommonJS 和 TypeScript 类型声明。预览运行于浏览器，第三方依赖默认通过 esm.sh 加载。

## 快速开始

导入组件及样式，将文件内容传入 `files`，并为预览区域设置高度：

```tsx
import { ReactPreviewer } from '@zllling/react-previewer';
import '@zllling/react-previewer/styles.css';

const files = {
  'App.tsx': `
import { useState } from 'react';
import './styles.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <button className="counter" onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
`,
  'styles.css': `
body { margin: 0; padding: 24px; }
.counter {
  padding: 12px 20px;
  color: white;
  background: #5167f6;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}
`
};

export default function Playground() {
  return (
    <ReactPreviewer
      files={files}
      entryFile="App.tsx"
      style={{ height: 400, borderRadius: 12 }}
    />
  );
}
```

`files` 的键是虚拟文件路径，值是源代码。入口文件默认是 `App.tsx`，需要默认导出 React 组件。将编辑器内容更新到 `files` 即可驱动实时预览。

以下配置示例沿用上面的 `files`。

## 依赖与样式

使用 `depsInfo` 指定预览代码所需的包版本，使用 `dependencyStyles` 配置对应的 CSS URL。样式可以是单个 URL，也可以是 URL 数组。

```tsx
<ReactPreviewer
  files={files}
  depsInfo={{ antd: '6.6.2' }}
  dependencyStyles={{
    antd: 'https://esm.sh/antd@6.6.2/dist/reset.css'
  }}
/>
```

预览中的 React / React DOM 默认使用 19.2.8，独立于宿主应用的版本。可以通过 `depsInfo.react` 指定版本；未单独配置的 React DOM 和 JSX runtime 会使用同一版本。

本地 CSS 可直接在预览代码中通过 `import './styles.css'` 引入。使用 Tailwind 工具类时，设置 `enableTailwind` 即可加载 Tailwind Browser runtime；默认关闭。

## 界面与交互

`className` / `style` 控制根节点，`classNames` / `styles` 支持 `root`、`loading`、`error`、`iframe` 四个样式插槽。可以替换加载和错误内容：

```tsx
<ReactPreviewer
  files={files}
  style={{ height: 400, borderRadius: 16 }}
  styles={{ iframe: { backgroundColor: '#f8fafc' } }}
  renderLoading={(status) => <p role="status">正在预览：{status.phase}</p>}
  renderError={(error) => <p role="alert">{error.message}</p>}
/>
```

启用 `isInspecting` 后，`onElementClick` 返回所选元素的源文件、行列范围和内容，可用于联动编辑器。路由通过 `initialPath` 配置，通过 `onRouteChange` 读取变化：

```tsx
<ReactPreviewer
  files={files}
  isInspecting
  onElementClick={(source) => console.log(source.file, source.startLine)}
  initialPath="/projects/42"
  onRouteChange={(route) => console.log(route.href)}
/>
```

通过 `onStatusChange` 可读取编译阶段、耗时和资源加载进度；`onError` 的第二个参数提供结构化错误信息，类型为 `compile`、`dependency` 或 `runtime`。默认错误界面在信息可用时展示源码位置、代码片段和堆栈。

## 编译器

| 模式 | 配置 | 适用场景 |
| --- | --- | --- |
| Babel | `compiler="babel"`（默认） | TSX / JSX 转换与日常组件预览 |
| Rspack Browser | `compiler="rspack-browser"` | 在浏览器中使用 Rspack 打包预览代码 |
| 自定义 | `compiler={adapter}` | 实现 `PreviewCompiler` 接口，扩展编译流程 |

Rspack Browser 使用 Web Worker 和 WebAssembly，需要承载页面启用跨源隔离：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

静态站点可通过等效的跨源隔离 service worker 配置，在线示例提供了相应实现。部署时需确保 Worker 与 WebAssembly 资源可访问；可以通过 `compiler.rspack.workerFactory` 自定义 Worker，包提供 `@zllling/react-previewer/rspack-browser-worker` 入口。

自定义编译器实例和 `workerFactory` 应保持稳定引用。配置类型见 [编译器接口](https://github.com/ForXd/react-previewer/blob/main/src/lib/ReactPreview/preview/compilers/types.ts)。

## API 概览

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `files` | 必填 | 文件路径到源代码的映射 |
| `entryFile` | `App.tsx` | 入口组件文件 |
| `depsInfo` | `{}` | 预览依赖及版本 |
| `dependencyStyles` | `{}` | 依赖对应的样式 URL 或 URL 数组 |
| `compiler` | `babel` | 内置编译器名称、配置对象或自定义实例 |
| `compileDelay` | `120` | 文件变化后的编译去抖时间，单位 ms |
| `enableTailwind` | `false` | 加载 Tailwind Browser runtime |
| `initialPath` | `/` | 预览路由，支持 pathname、query 和 hash |
| `isInspecting` | `false` | 启用元素源码检查 |
| `className` / `style` | — | 根节点样式 |
| `classNames` / `styles` | — | 各样式插槽配置 |
| `renderLoading` / `renderError` | — | 自定义加载与错误内容 |
| `iframeTitle` | `React preview` | iframe 的可访问名称 |
| `onStatusChange` | — | 接收 `PreviewStatus` |
| `onError` | — | 接收 `Error` 与结构化 `ErrorInfo` |
| `onElementClick` | — | 接收元素的 `SourceInfo` |
| `onRouteChange` | — | 接收 `PreviewRouteState` |

完整属性见 [ReactPreviewerProps](https://github.com/ForXd/react-previewer/blob/main/src/lib/ReactPreview/preview/types.ts)。公共类型均可从 `@zllling/react-previewer` 导入。

## 本地开发

使用 [.node-version](https://github.com/ForXd/react-previewer/blob/main/.node-version) 指定的 Node.js 版本：

```bash
npm ci
npm run dev
```

提交前运行 `npm run check`，执行代码规范、类型、测试、构建和安装包验证。贡献流程与发布约定见 [贡献指南](https://github.com/ForXd/react-previewer/blob/main/CONTRIBUTING.md)；模块边界见 [架构设计](https://github.com/ForXd/react-previewer/blob/main/DESIGN.md)，依赖说明见 [依赖清单](https://github.com/ForXd/react-previewer/blob/main/DEPENDENCIES.md)。

## License

[MIT](https://github.com/ForXd/react-previewer/blob/main/LICENSE)
