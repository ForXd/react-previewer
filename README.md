# React Previewer

一个强大的 React 代码预览器组件，支持实时编译、错误处理和依赖分析。

## 功能特性

- 🚀 **实时编译**: 支持 TypeScript/JSX 代码的实时编译和预览
- 🔍 **错误处理**: 完善的编译时和运行时错误捕获与显示
- 📦 **依赖分析**: 自动分析和管理代码依赖关系
- 🎨 **可定制**: 支持自定义样式和配置
- 📝 **日志系统**: 内置统一的日志管理系统
- 🔧 **开发工具**: 提供调试面板和源码映射功能

## 安装

```bash
npm install @zllling/react-previewer
```

## 使用方法

### 基本使用

```tsx
import React from 'react';
import { ReactPreviewer } from '@zllling/react-previewer';

// 引入样式（必需）
import '@zllling/react-previewer/styles.css';

const App = () => {
  const files = {
    'App.tsx': `
import React from 'react';

const App = () => {
  return (
    <div>
      <h1>Hello, React Previewer!</h1>
      <p>这是一个实时预览的 React 组件</p>
    </div>
  );
};

export default App;
    `
  };

  const depsInfo = {
    'react': '18.2.0',
    'react-dom': '18.2.0'
  };

  return (
    <ReactPreviewer
      files={files}
      depsInfo={depsInfo}
      entryFile="App.tsx"
      onError={(error) => console.error('Preview error:', error)}
      onElementClick={(sourceInfo) => console.log('Element clicked:', sourceInfo)}
    />
  );
};
```

### 样式引入方式

有两种方式引入样式：

#### 方式一：在入口文件引入（推荐）

```tsx
// 在你的应用入口文件（如 main.tsx 或 App.tsx）中
import '@zllling/react-previewer/styles.css';
```

#### 方式二：在组件文件中引入

```tsx
import { ReactPreviewer } from '@zllling/react-previewer';
import '@zllling/react-previewer/styles.css';

// 你的组件代码...
```

### 高级配置

```tsx
import React from 'react';
import { ReactPreviewer } from '@zllling/react-previewer';

function App() {
  const files = {
    'App.tsx': `/* 你的 React 代码 */`,
    'styles.css': `/* 你的 CSS 样式 */`
  };

  return (
    <ReactPreviewer
      files={files}
      entryFile="App.tsx"
      depsInfo={{
        react: '18.2.0',
        'react-dom': '18.2.0',
        '@arco-design/web-react': '2.66.1'
      }}
      onError={(error) => {
        console.error('预览错误:', error);
      }}
      onElementClick={(sourceInfo) => {
        console.log('点击的元素源码信息:', sourceInfo);
      }}
    />
  );
}
```

## API 参考

### ReactPreviewer Props

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `files` | `Record<string, string>` | ✅ | - | 要预览的文件内容 |
| `depsInfo` | `Record<string, string>` | ✅ | - | 依赖包信息 |
| `entryFile` | `string` | ❌ | `'App.tsx'` | 入口文件名 |
| `onError` | `(error: Error) => void` | ❌ | - | 错误回调函数 |
| `onElementClick` | `(sourceInfo: SourceInfo) => void` | ❌ | - | 元素点击回调 |
| `loggerConfig` | `Partial<LoggerConfig>` | ❌ | - | 日志配置 |

### 类型定义

```typescript
interface SourceInfo {
  file: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
  content: string;
  position: { x: number; y: number };
}

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
  showTimestamp?: boolean;
}
```

## 高级用法

### 配置日志系统

```tsx
import { ReactPreviewer, LogLevel } from '@zllling/react-previewer';

<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  loggerConfig={{
    enabled: true,
    level: LogLevel.DEBUG,
    prefix: '[MyApp]',
    showTimestamp: true
  }}
/>
```

### 使用独立的组件

```tsx
import { 
  PreviewFrame, 
  ErrorBoundary, 
  ErrorDisplay,
  PreviewerToolbar 
} from '@zllling/react-previewer';

// 使用预览帧
<PreviewFrame
  files={files}
  entryFile="App.tsx"
  depsInfo={depsInfo}
  onError={handleError}
  isInspecting={true}
/>

// 使用错误边界
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// 使用错误显示
<ErrorDisplay error={error} />
```

### 使用编译器工具

```tsx
import { 
  CodeTransformer, 
  TypeScriptDependencyAnalyzer,
  DependencyGraph 
} from '@zllling/react-previewer';

// 代码转换
const transformer = new CodeTransformer();
const result = await transformer.transform(code, 'App.tsx');

// 依赖分析
const analyzer = new TypeScriptDependencyAnalyzer();
const dependencies = await analyzer.analyze(code, 'App.tsx', files);

// 依赖图构建
const graph = new DependencyGraph();
graph.buildFromFiles(files);
```

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建组件库

```bash
npm run build:lib
```

### 发布到 npm

```bash
npm publish
```

## 注意事项

1. **样式引入**：必须引入样式文件，否则组件可能显示异常
2. **依赖管理**：确保在 `depsInfo` 中正确配置所需的依赖包
3. **文件格式**：支持 `.tsx`、`.ts`、`.jsx`、`.js`、`.css` 等文件格式

## 架构与优化点

ReactPreview 的主链路分为四层：

1. **ReactPreviewer**：管理工具栏、检查模式、视口尺寸、缩放和编译状态。
2. **PreviewFrame**：管理 iframe 生命周期、编译调度、错误展示和父子窗口消息。
3. **CodeTransformer**：构建依赖图，按依赖顺序转换 TS/JSX，并注入源码定位属性。
4. **FileProcessor / HTMLGenerator**：生成模块 blob URL、注入 import map、加载依赖并渲染应用。

本版本重点优化：

- 使用完整文件内容和依赖版本生成签名，避免仅文件前缀变化检测导致的漏编译。
- 编译任务支持去抖和运行序号取消，频繁编辑时只渲染最新结果。
- 正确释放模块和 HTML blob URL，降低长时间预览或多次重编译后的内存压力。
- 工具栏透出编译状态、耗时、文件数、响应式视口和缩放控制，便于调试复杂组件。
- 自闭合 JSX 也会注入源码定位范围，检查模式覆盖更完整。

## 许可证

MIT
