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
const logger = createModuleLogger('MyModule');
logger.debug('Processing file:', fileName);
logger.error('Error occurred:', error);
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