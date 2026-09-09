# AI 页面生成与实时预览：接入评估

调研日期：2026-09-09。代码基线：`origin/main` 的 `3ed0bc0`。远端不存在 `master`，本调研分支从最新 `main` 创建。本文是实现建议，尚未实现或调用真实模型 API。

## 结论

可以基于现有组件实现“输入需求 → 流式生成 React 页面 → 自动预览 → 继续修改”。模型 API 的选择与免费条件见 [供应商调研](./free-llm-apis.md)。现有库已覆盖编译、依赖加载、iframe 渲染和错误回传；新增功能主要属于 demo/应用层，以及一个保护 API Key 的服务端接口。

“实时”建议定义为代码逐步显示、完整可编译版本自动预览。模型输出的半截 JSX 不能直接稳定运行；逐 token 更新 `files` 会反复触发编译，而且连续输入可能不断重置防抖计时。

## 现有能力和限制（源码依据）

| 能力 | 证据 | 接入意义 |
| --- | --- | --- |
| 文件映射、入口、依赖、样式配置 | [ReactPreviewerProps](../../src/lib/ReactPreview/preview/types.ts) | 把模型结果转换为 `Record<string, string>`，无需另造预览引擎 |
| 根据内容变化编译，默认延迟 120ms | [usePreviewRuntime](../../src/lib/ReactPreview/preview/runtime/usePreviewRuntime.ts) | 可用 `compileDelay` 控制预览防抖；不是流式 JSX 修复器 |
| 过期编译结果失效、串行管理编译资源 | [CompilationSession](../../src/lib/ReactPreview/preview/runtime/CompilationSession.ts) | 降低异步覆盖风险；生成请求本身仍需独立 requestId 和取消控制 |
| 编译/依赖/运行时错误以及阶段回调 | [types](../../src/lib/ReactPreview/preview/types.ts) | 可展示错误，并支持有次数上限的修复 |
| 多文件 TSX 与本地 CSS 示例 | [overviewDemo](../../src/demo/examples/overviewDemo.ts) | 可直接作为模型输出格式示例 |
| 默认导出组件由运行时挂载 | [HTMLGenerator](../../src/lib/ReactPreview/preview/utils/HTMLGenerator.ts) | 约定 `App.tsx` 默认导出组件，模型无需调用 `createRoot` |
| 每次安装新文档更换 iframe | [PreviewFrame](../../src/lib/ReactPreview/preview/components/PreviewFrame.tsx) | 更新会重置页面交互状态；不应承诺 HMR 式状态保留 |
| 同源 iframe，允许 scripts 和 same-origin | [PreviewFrame](../../src/lib/ReactPreview/preview/components/PreviewFrame.tsx) | 当前隔离不能作为执行不可信 AI 代码的安全边界 |

## 建议的最小实现

```text
需求输入 / 修改指令
       ↓
应用服务端 POST /api/generate（Key、限流、供应商适配）
       ↓ 流式响应
生成控制器：文本缓冲 → 完整文件解析 → 校验 → 版本快照
       ├─ 编辑器：显示正在生成的代码
       └─ ReactPreviewer：只接收完整快照 → 状态 / 错误
```

1. 第一版固定 `App.tsx` 和 `styles.css`，只允许 React、React DOM 和本地 CSS。先不开放任意 npm 依赖、服务端代码或安装脚本。
2. 提示词约定默认导出 React 组件、使用模拟数据、不生成 API Key、不自行挂载 React。输出完整文件对象，例如 `{ "files": { "App.tsx": "…", "styles.css": "…" } }`。
3. 将原始流和生效文件分开管理。第一版在最终 JSON 完整解析、路径/大小/import 检查通过后一次性替换文件；生成期间保留上一个预览。这提供流式代码展示和完成后自动预览。
4. 若要求生成途中多次看到页面，第二版引入显式版本提交协议：每个版本必须包含可独立运行的全部文件，收到完整 `snapshot_end` 再提交。不要把 HTTP chunk 当作 token、完整 JSON 或完整文件边界；解析器应处理跨 chunk、截断和转义。
5. TSX 语法通过不代表可运行；依赖完整性和运行时错误还需预览验证。要可靠保留上一个可用页面，可用候选预览实例在 `ready` 后切换，错误时保留旧实例；现有单实例没有完整事务回滚保证。
6. 加入停止生成、超时、requestId、防止旧请求写回。429 显示额度耗尽并允许手动重试，按供应商 `Retry-After` 退避；取消/截断不覆盖已生效文件，不自动转付费路由。
7. 下一步再做“继续修改当前页面”：发送需求、当前文件和必要的错误摘要；自动修复最多一次，避免免费额度被循环消耗。

建议应用层新增 `src/demo/ai/`，包含生成面板、生成会话和文件协议解析；服务端独立部署。现有 GitHub Pages 只部署静态 `page/`，不能直接提供生成 API。模型 Key 必须留在服务端环境变量中，不能打包进 Vite 客户端。

## 执行生成代码前的必要改造

源码使用同源 `document.write`，且 sandbox 同时允许脚本与同源。生成的 JavaScript 可能访问宿主页面和同源存储，因此不能把共享 API Key、登录态或其他敏感数据放在该执行环境中。

公开产品应把预览运行在独立、无敏感凭证的 origin，通过受控 `postMessage` 协议传递文件和状态，检查消息来源与结构，并配置网络/资源策略。这涉及当前 `contentDocument` 写入机制和消息协议调整，不能简单删掉 `allow-same-origin` 就视为完成。文件白名单和提示词约束有助于格式控制，但不是代码安全沙箱。仅做个人原型时也应使用无敏感会话的隔离环境。

## 验收与供应商试跑

选一个账号可用的免费提供商后，用同一组 10 条中文需求试跑：落地页、仪表盘、表单、多栏列表及其修改指令。记录首 token 时间、首次有效预览时间、首次编译/运行成功率、429 比例和 token 用量，再决定默认模型。未实测前不以宣传的推理速度替代整页生成效果。

实现时验证流式拆包、截断、取消、并发请求、非法路径/import、额度耗尽、编译失败和一次修复；验证手机宽度及连续修改。按仓库要求运行 `npm run check`，涉及 demo 时提交生成的 `page/`，库构建 `dist/` 保持不入 Git。本次仅新增调研文档，不涉及源代码或生成页面。
