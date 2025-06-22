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
npm install react-previewer
```

## 基本使用

```tsx
import React from 'react';
import { ReactPreviewer } from 'react-previewer';

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
import { ReactPreviewer, LogLevel } from 'react-previewer';

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
} from 'react-previewer';

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
} from 'react-previewer';

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

## 许可证

MIT
