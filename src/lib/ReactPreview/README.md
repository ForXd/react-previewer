# ReactPreview 依赖加载系统

ReactPreview 提供了一个智能的依赖加载系统，支持 ESM 动态依赖加载，并提供实时的加载状态反馈。同时支持多种编译策略，包括 Babel 和 SWC 编译器。

## 核心功能特性

### 依赖加载功能
- **实时加载进度**: 显示依赖加载的实时进度条
- **详细状态反馈**: 显示每个依赖的加载状态（等待中、加载中、已加载、加载失败）
- **错误处理**: 自动处理依赖加载失败的情况
- **用户友好界面**: 美观的加载界面，提供清晰的加载信息
- **支持多种依赖**: 支持 React、React DOM、第三方 UI 库等
- **动态加载**: 使用 ESM 动态导入，支持按需加载

### 编译策略功能
- **多编译器支持**: 支持 Babel 和 SWC 两种编译器
- **灵活配置**: 可配置 JSX 运行时、目标环境、TypeScript 支持等
- **自动回退**: 支持编译失败时自动回退到其他编译器
- **性能优化**: SWC 提供更快的编译速度，Babel 提供更全面的功能
- **实时切换**: 可在运行时切换编译器，无需重启

## 编译策略界面

用户可以通过界面配置编译策略：

1. **编译器选择**: 在 Babel 和 SWC 之间切换
2. **JSX 运行时**: 选择 React JSX 自动模式或经典模式
3. **目标环境**: 设置编译目标（ES2015-ES2022）
4. **功能开关**: 启用/禁用 TypeScript、代码压缩、源码映射等
5. **自动回退**: 启用编译失败时的自动回退机制

## 使用方法

### 1. 基本使用

```typescript
import { ReactPreviewer } from './preview/ReactPreviewer';

const files = {
  'App.tsx': 'import React from "react"; const App = () => <div>Hello World</div>; export default App;'
};

const depsInfo = {
  'react': '18.2.0',
  'react-dom': '18.2.0',
  '@arco-design/web-react': '2.66.1'
};

<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  entryFile="App.tsx"
/>
```

### 2. 编译策略配置

```typescript
import { ReactPreviewer } from './preview/ReactPreviewer';
import type { CompilerConfig } from './preview/types';

const compilerConfig: CompilerConfig = {
  type: 'swc', // 'babel' | 'swc'
  options: {
    target: 'es2020',
    jsx: 'react-jsx', // 'react-jsx' | 'react' | 'preserve'
    typescript: true,
    minify: false,
    sourceMaps: false
  },
  autoFallback: true
};

<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  entryFile="App.tsx"
  compilerConfig={compilerConfig}
/>
```

### 3. 高级编译配置

```typescript
// Babel 配置示例
const babelConfig: CompilerConfig = {
  type: 'babel',
  options: {
    target: 'es2018',
    jsx: 'react',
    typescript: true,
    minify: true,
    sourceMaps: true
  },
  autoFallback: true
};

// SWC 配置示例
const swcConfig: CompilerConfig = {
  type: 'swc',
  options: {
    target: 'es2022',
    jsx: 'react-jsx',
    typescript: true,
    minify: false,
    sourceMaps: false
  },
  autoFallback: false
};
```

### 4. 依赖配置

```typescript
// 支持的依赖格式
const depsInfo = {
  // 基础 React 依赖
  'react': '18.2.0',
  'react-dom': '18.2.0',
  
  // UI 组件库
  '@arco-design/web-react': '2.66.1',
  '@arco-design/web-react/icon': '2.66.1',
  
  // 工具库
  'lodash': '4.17.21',
  'dayjs': '1.11.10',
  
  // 其他库
  'axios': '1.6.0'
};
```

### 5. 错误处理

```typescript
<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  compilerConfig={compilerConfig}
  onError={(error) => {
    console.error('预览错误:', error);
    // 处理编译或依赖加载错误
  }}
/>
```

## 编译器对比

| 特性 | Babel | SWC |
|------|-------|-----|
| 编译速度 | 较慢 | 很快 |
| 功能完整性 | 全面 | 基础 |
| 插件生态 | 丰富 | 有限 |
| 内存占用 | 较高 | 较低 |
| TypeScript 支持 | 完整 | 基础 |
| 源码映射 | 完整 | 基础 |
| 自定义插件 | 支持 | 不支持 |

## 测试 Demo

### 1. 简单 React 组件测试

```typescript
import { simpleReactDemo } from './test/demo';

// 使用简单 React 组件测试
<ReactPreviewer
  files={simpleReactDemo.files}
  depsInfo={JSON.parse(simpleReactDemo['deps.json'])}
  entryFile="App.tsx"
  compilerConfig={{ type: 'babel' }}
/>
```

### 2. 依赖加载测试

```typescript
import { dependencyLoadingDemo } from './test/demo';

// 测试依赖加载功能
<ReactPreviewer
  files={dependencyLoadingDemo.files}
  depsInfo={JSON.parse(dependencyLoadingDemo['deps.json'])}
  entryFile="App.tsx"
  compilerConfig={{ type: 'swc' }}
/>
```

### 3. Arco Design 组件测试

```typescript
import { arcoDesignDemo } from './test/demo';

// 测试第三方 UI 库加载
<ReactPreviewer
  files={arcoDesignDemo.files}
  depsInfo={JSON.parse(arcoDesignDemo['deps.json'])}
  entryFile="App.tsx"
  compilerConfig={{ type: 'babel', options: { minify: true } }}
/>
```

## 技术实现

### 1. 编译策略架构

使用策略模式实现多编译器支持：

```typescript
import { CompilerManager, BabelStrategy, SwcStrategy } from './compiler';

const compilerManager = new CompilerManager();

// 注册编译策略
compilerManager.registerStrategy('babel', new BabelStrategy());
compilerManager.registerStrategy('swc', new SwcStrategy());

// 使用指定策略编译
const result = await compilerManager.transform(code, {
  compiler: 'swc',
  filename: 'App.tsx'
});
```

### 2. 依赖解析

使用 `DependencyResolver` 将依赖信息转换为 ESM.sh 链接：

```typescript
import { transformDepsToEsmLinks } from './preview/DependencyResolver';

const result = transformDepsToEsmLinks(depsInfo, {
  target: 'es2022',
  bundle: false,
  external: ['react', 'react-dom']
});
```

### 3. 动态加载器

在 iframe 中注入动态依赖加载器：

```javascript
const dynamicDependencyLoader = {
  dependencies: new Map(),
  loadedCount: 0,
  totalCount: 0,
  
  // 添加依赖
  addDependencies(deps) {
    deps.forEach(dep => {
      this.dependencies.set(dep.name, { url: dep.url, status: 'pending' });
      this.totalCount++;
    });
  },
  
  // 更新加载状态
  setDependencyStatus(name, status) {
    const dep = this.dependencies.get(name);
    if (dep) {
      dep.status = status;
      if (status === 'loaded') {
        this.loadedCount++;
      }
      this.updateUI();
    }
  }
};
```

### 4. 进度显示

实时更新加载进度和状态：

```javascript
updateUI() {
  const progress = (this.loadedCount / this.totalCount) * 100;
  this.progressFill.style.width = progress + '%';
  this.progressText.textContent = Math.round(progress) + '%';
  
  // 更新依赖详情列表
  this.updateDependencyList();
}
```

## 最佳实践

### 1. 编译器选择

- **开发环境**: 推荐使用 Babel，功能更全面，错误信息更详细
- **生产环境**: 推荐使用 SWC，编译速度更快，性能更好
- **TypeScript 项目**: 优先使用 Babel，TypeScript 支持更完整
- **简单项目**: 可以使用 SWC，配置简单，速度快

### 2. 编译配置

- **目标环境**: 根据目标浏览器设置合适的 ES 版本
- **JSX 运行时**: 新项目推荐使用 `react-jsx`，无需手动导入 React
- **代码压缩**: 生产环境建议启用，减少文件大小
- **源码映射**: 开发环境建议启用，便于调试

### 3. 依赖管理

- **版本固定**: 使用固定版本号，避免兼容性问题
- **最小化依赖**: 只包含必要的依赖
- **CDN 选择**: 使用可靠的 CDN 服务

### 4. 用户体验

- **加载提示**: 提供清晰的加载状态信息
- **错误处理**: 优雅处理编译和加载错误
- **自动回退**: 启用自动回退机制，提高成功率

## API 参考

### ReactPreviewer Props

```typescript
interface ReactPreviewerProps {
  files: Record<string, string>;
  depsInfo: Record<string, string>;
  entryFile?: string;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  loggerConfig?: Partial<LoggerConfig>;
  compilerConfig?: CompilerConfig;
}
```

### CompilerConfig

```typescript
interface CompilerConfig {
  type?: CompilerType; // 'babel' | 'swc'
  options?: CompilerOptions;
  autoFallback?: boolean;
}
```

### CompilerOptions

```typescript
interface CompilerOptions {
  target?: string; // ES 版本
  jsx?: 'react' | 'react-jsx' | 'preserve';
  typescript?: boolean;
  minify?: boolean;
  sourceMaps?: boolean;
}
```

## 示例项目

查看 `example.tsx` 文件了解完整的使用示例，包括：

- 编译策略配置界面
- 实时编译器切换
- 编译选项调整
- 错误处理和回退机制
- 性能对比演示

---

# ReactPreview 日志系统

ReactPreview 提供了一个统一的日志系统，用于管理和控制整个预览器的日志输出。

## 功能特性

- **统一日志管理**: 所有模块使用统一的日志接口
- **可配置级别**: 支持 ERROR、WARN、INFO、DEBUG、TRACE 五个级别
- **模块化日志**: 每个模块都有独立的日志标识
- **可配置开关**: 可以全局启用/禁用日志输出
- **时间戳支持**: 可选择是否显示时间戳
- **运行时配置**: 可以在 ReactPreviewer 组件中动态配置

## 日志级别

```typescript
enum LogLevel {
  ERROR = 0,   // 错误信息
  WARN = 1,    // 警告信息
  INFO = 2,    // 一般信息
  DEBUG = 3,   // 调试信息
  TRACE = 4    // 跟踪信息
}
```

## 使用方法

### 1. 基本使用

```typescript
import { logger, createModuleLogger } from './preview/utils/Logger';

// 使用全局 logger
logger.info('这是一条信息日志');
logger.error('这是一条错误日志');
logger.debug('这是一条调试日志');

// 使用模块 logger
const moduleLogger = createModuleLogger('MyModule');
moduleLogger.info('模块信息');
moduleLogger.debug('模块调试信息');
```

### 2. 在 ReactPreviewer 中配置

```typescript
import { ReactPreviewer } from './preview/ReactPreviewer';

const loggerConfig = {
  enabled: true,           // 启用日志
  level: LogLevel.DEBUG,   // 设置日志级别
  prefix: '[MyApp]',       // 自定义前缀
  showTimestamp: true      // 显示时间戳
};

<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  loggerConfig={loggerConfig}
/>
```

### 3. 配置选项

```typescript
interface LoggerConfig {
  enabled: boolean;        // 是否启用日志
  level: LogLevel;         // 日志级别
  prefix?: string;         // 日志前缀
  showTimestamp?: boolean; // 是否显示时间戳
}
```

## 模块日志

每个模块都可以创建自己的日志实例：

```typescript
// 在 ErrorHandler 中
const logger = createModuleLogger('ErrorHandler');
logger.debug('处理运行时错误');

// 在 PreviewFrame 中
const logger = createModuleLogger('PreviewFrame');
logger.info('预览帧已加载');

// 在 MessageHandler 中
const logger = createModuleLogger('MessageHandler');
logger.trace('收到消息');
```

## 日志输出示例

```
[ReactPreview][INFO] Logger configured with: {enabled: true, level: 2}
[ReactPreview][DEBUG][PreviewFrame] Element clicked: {file: "App.tsx", startLine: 10}
[ReactPreview][ERROR][ErrorHandler] Failed to process file: App.tsx
[ReactPreview][TRACE][MessageHandler] Received message: {type: "element-click"}
```

## 最佳实践

1. **合理使用日志级别**:
   - ERROR: 用于错误和异常
   - WARN: 用于警告和潜在问题
   - INFO: 用于重要的状态变化
   - DEBUG: 用于调试信息
   - TRACE: 用于详细的执行跟踪

2. **模块化日志**:
   - 每个模块使用独立的 logger 实例
   - 便于过滤和查找特定模块的日志

3. **性能考虑**:
   - 在生产环境中可以禁用 DEBUG 和 TRACE 级别
   - 避免在循环中输出大量日志

4. **配置管理**:
   - 根据环境设置不同的日志级别
   - 开发环境可以使用 DEBUG 级别
   - 生产环境建议使用 INFO 或 WARN 级别

## 迁移指南

### 从 console.log 迁移

**之前:**
```typescript
console.log('Processing file:', fileName);
console.error('Error occurred:', error);
```

**之后:**
```typescript
const moduleLogger = createModuleLogger('MyModule');
moduleLogger.debug('Processing file:', fileName);
moduleLogger.error('Error occurred:', error);
```

### 批量替换

可以使用以下正则表达式批量替换：

```regex
// 替换 console.log
console\.log\((.*?)\); → logger.debug($1);

// 替换 console.error
console\.error\((.*?)\); → logger.error($1);

// 替换 console.warn
console\.warn\((.*?)\); → logger.warn($1);
```

## 注意事项

1. **保留测试用的 console.log**: 在 demo 中用于测试错误捕获的 console.log 应该保留
2. **异步日志**: 日志输出是同步的，不会影响性能
3. **浏览器兼容性**: 支持所有现代浏览器
4. **内存管理**: 日志系统使用单例模式，不会造成内存泄漏 