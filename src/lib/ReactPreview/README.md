# ReactPreview 内部说明

完整用户文档见仓库根目录 `README.md`。本目录包含组件库源码，主链路如下：

- `ReactPreviewer`：管理工具栏、视口、缩放、检查模式和整体状态。
- `PreviewFrame`：管理 iframe、编译调度、资源状态消息和错误展示。
- `CodeTransformer`：构建依赖图，转换 TSX/JSX，并注入源码定位属性。
- `HTMLGenerator`：生成 iframe HTML、import map、资源加载 runtime 和预览启动脚本。
- `DependencyResolver`：把 `depsInfo` 转为 ESM CDN URL，并生成 JS/CSS/Tailwind 资源队列。

资源 loading 覆盖四类内容：

- 编译后的本地模块 blob。
- `depsInfo` 声明的 JS 依赖。
- `dependencyStyles` 和默认组件库样式。
- 用户代码中的本地或远程 CSS import。

常用验证命令：

```bash
npm run lint
npm run build:lib
npm run dev
```
