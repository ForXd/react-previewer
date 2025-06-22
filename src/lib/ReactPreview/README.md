# ReactPreview 依赖加载系统

ReactPreview 提供了一个智能的依赖加载系统，支持 ESM 动态依赖加载，并提供实时的加载状态反馈。

## 依赖加载功能特性

- **实时加载进度**: 显示依赖加载的实时进度条
- **详细状态反馈**: 显示每个依赖的加载状态（等待中、加载中、已加载、加载失败）
- **错误处理**: 自动处理依赖加载失败的情况
- **用户友好界面**: 美观的加载界面，提供清晰的加载信息
- **支持多种依赖**: 支持 React、React DOM、第三方 UI 库等
- **动态加载**: 使用 ESM 动态导入，支持按需加载

## 依赖加载界面

当页面加载时，用户会看到：

1. **加载覆盖层**: 半透明的覆盖层，防止用户操作
2. **进度条**: 显示整体加载进度（0-100%）
3. **依赖列表**: 显示每个依赖的详细加载状态
4. **状态指示器**: 不同颜色表示不同状态
   - 🔵 蓝色：等待中
   - 🟡 黄色：加载中  
   - 🟢 绿色：已加载
   - 🔴 红色：加载失败

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

### 2. 依赖配置

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

### 3. 错误处理

```typescript
<ReactPreviewer
  files={files}
  depsInfo={depsInfo}
  onError={(error) => {
    console.error('预览错误:', error);
    // 处理依赖加载错误
  }}
/>
```

## 测试 Demo

### 1. 简单 React 组件测试

```typescript
import { simpleReactDemo } from './test/demo';

// 使用简单 React 组件测试
<ReactPreviewer
  files={simpleReactDemo.files}
  depsInfo={JSON.parse(simpleReactDemo['deps.json'])}
  entryFile="App.tsx"
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
/>
```

## 技术实现

### 1. 依赖解析

使用 `DependencyResolver` 将依赖信息转换为 ESM.sh 链接：

```typescript
import { transformDepsToEsmLinks } from './preview/DependencyResolver';

const result = transformDepsToEsmLinks(depsInfo, {
  target: 'es2022',
  bundle: false,
  external: ['react', 'react-dom']
});
```

### 2. 动态加载器

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

### 3. 进度显示

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

### 1. 依赖管理

- **版本固定**: 使用固定版本号，避免兼容性问题
- **最小化依赖**: 只包含必要的依赖
- **CDN 选择**: 使用可靠的 CDN 服务

### 2. 用户体验

- **加载提示**: 提供清晰的加载状态信息
- **错误处理**: 优雅处理加载失败的情况
- **性能优化**: 避免加载过大的依赖包

### 3. 开发调试

- **日志记录**: 使用日志系统记录加载过程
- **错误监控**: 监控依赖加载失败的情况
- **性能监控**: 监控加载时间和成功率

## 注意事项

1. **网络依赖**: 依赖加载需要网络连接
2. **CDN 可用性**: 依赖 CDN 服务的可用性
3. **版本兼容性**: 确保依赖版本之间的兼容性
4. **加载时间**: 大型依赖可能需要较长的加载时间

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