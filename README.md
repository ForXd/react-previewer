# React Previewer

一个面向组件编辑器、低代码预览和在线示例的 React 代码预览组件。它在 iframe 中编译并运行 TSX/JSX 文件，支持第三方 ESM 依赖、组件库样式、本地 CSS、运行时错误捕获和源码定位。

## 安装

```bash
npm install @zllling/react-previewer
```

在应用入口引入组件库样式：

```tsx
import '@zllling/react-previewer/styles.css';
```

## 基本用法

```tsx
import { ReactPreviewer } from '@zllling/react-previewer';
import '@zllling/react-previewer/styles.css';

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
  border-radius: 8px;
  background: white;
}
  `
};

export default function Page() {
  return (
    <ReactPreviewer
      files={files}
      entryFile="App.tsx"
      depsInfo={{
        react: '18.2.0',
        'react-dom': '18.2.0'
      }}
    />
  );
}
```

## 依赖与 CSS

`depsInfo` 用于声明 iframe 内需要从 ESM CDN 加载的 JS 依赖。组件会自动生成 import map，并在渲染前加载依赖。

```tsx
<ReactPreviewer
  files={files}
  depsInfo={{
    '@arco-design/web-react': '2.66.1',
    '@arco-design/web-react/icon': '2.66.1'
  }}
/>
```

`dependencyStyles` 用于声明第三方依赖对应的 CSS。默认已内置 `@arco-design/web-react` 的样式地址，可以通过该配置覆盖或追加其他组件库样式：

```tsx
<ReactPreviewer
  files={files}
  depsInfo={{
    '@arco-design/web-react': '2.66.1',
    antd: '5.18.0'
  }}
  dependencyStyles={{
    antd: 'https://esm.sh/antd@5.18.0/dist/reset.css',
    '@arco-design/web-react': [
      'https://esm.sh/@arco-design/web-react@2.66.1/dist/css/arco.min.css'
    ]
  }}
/>
```

本地 CSS import 会被编译为 iframe 内的样式注入：

```tsx
import './styles.css';
```

远程 CSS import 会被编译为 iframe 内的 link 加载，并进入同一套资源进度：

```tsx
import 'https://example.com/theme.css';
```

## Loading 生命周期

预览状态统一覆盖编译、JS 依赖、CSS 资源和渲染阶段。外层 loading 会展示当前阶段、资源进度和正在加载的资源，避免“组件已渲染但 CSS 还没加载”的闪烁。

状态阶段：

| phase | 含义 |
| --- | --- |
| `compiling` | 正在转换用户文件 |
| `loading-js` | 正在加载 React、React DOM 或第三方 JS 依赖 |
| `loading-css` | 正在加载组件库 CSS、Tailwind CDN 或用户 CSS |
| `rendering` | 依赖已就绪，正在挂载 React 应用 |
| `ready` | 预览已完成 |
| `error` | 编译或运行错误 |

## API

```ts
interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
  entryFile?: string;
  initialPath?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  onRouteChange?: (route: PreviewRouteState) => void;
  loggerConfig?: Partial<LoggerConfig>;
  compileDelay?: number;
  showToolbar?: boolean;
  className?: string;
  defaultViewport?: PreviewViewport;
  defaultZoom?: number;
  onStatusChange?: (status: PreviewStatus) => void;
  compiler?: PreviewCompilerConfig | 'babel' | 'rspack-browser';
}
```

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `files` | 必填 | 文件名到文件内容的映射，入口文件必须存在 |
| `depsInfo` | `{}` | 第三方依赖版本，转换为 ESM CDN 地址 |
| `dependencyStyles` | `{}` | 第三方依赖对应 CSS 地址，支持单个或多个 URL |
| `entryFile` | `'App.tsx'` | 预览入口文件 |
| `initialPath` | `'/'` | 预览应用启动时的路由路径，支持 pathname、query 和 hash |
| `compileDelay` | `120` | 文件变化后的编译去抖时间，单位 ms |
| `showToolbar` | `true` | 是否显示工具栏 |
| `defaultViewport` | Auto | 初始预览尺寸 |
| `defaultZoom` | `1` | 初始缩放比例 |
| `onStatusChange` | - | 编译和资源加载状态回调 |
| `compiler` | `'babel'` | 编译后端。传入 `'rspack-browser'` 或 `{ type: 'rspack-browser' }` 后使用 `@rspack/browser` 在 Web Worker 中编译预览。 |
| `onElementClick` | - | 检查模式下点击元素后的源码位置信息 |
| `onRouteChange` | - | iframe 内路由变化回调，包含 pathname、search、hash 和 href |

### Rspack Browser 编译

```tsx
<ReactPreviewer
  files={files}
  entryFile="App.tsx"
  compiler={{
    type: 'rspack-browser',
    rspack: {
      cdnDomain: 'https://esm.sh'
    }
  }}
/>
```

`@rspack/browser` 使用 `SharedArrayBuffer`，预览页面所在服务需要设置跨域隔离响应头：

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

```ts
interface PreviewRouteState {
  pathname: string;
  search: string;
  hash: string;
  href: string;
}
```

```ts
interface PreviewStatus {
  isLoading: boolean;
  phase: 'idle' | 'compiling' | 'loading-js' | 'loading-css' | 'rendering' | 'ready' | 'error';
  error: ErrorInfo | null;
  compileDuration: number | null;
  transformedFiles: number;
  resourceTotal: number;
  resourceLoaded: number;
  resourceProgress: number;
}
```

## 常见问题

**为什么样式文件必须等待加载完成？**  
组件库 CSS 和用户 CSS 会影响首屏布局。预览器会在渲染前等待关键 CSS 完成或超时，尽量避免首屏闪烁。

**CSS 加载失败会怎样？**  
失败会通过 iframe 消息记录为资源错误，同时 loading 不会永久卡住。预览会继续尝试渲染，便于用户看到 JS 结果和错误信息。

**为什么需要固定依赖版本？**  
固定版本能保证 ESM CDN 地址稳定，减少预览结果随时间变化的风险。

**可以关闭工具栏吗？**  
可以。传入 `showToolbar={false}` 后只保留预览区域。

## 开发

```bash
npm install
npm run dev
npm run lint
npm run build:lib
```

发布前会执行：

```bash
npm run build:lib
```

## License

MIT
