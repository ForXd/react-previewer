# AI 页面生成

AI Studio 使用现有 ReactPreviewer 编译并预览生成的 React 页面。支持中文需求、流式输出、新建页面、继续修改、停止生成及手机宽度预览。生成失败或候选页面加载失败时保留上一个成功预览。代码在完整响应结束后自动预览，不执行生成中的半截 JSX。

## 本地启动

需要符合 package.json engines 的 Node 版本。

```sh
npm install
cp .env.ai.example .env.ai
# 编辑 .env.ai，填入自己的 AI_API_KEY
npm run dev:ai
```

打开 `http://127.0.0.1:5173/#ai`。该命令同时启动工作台（5173）、独立来源预览（5174）和仅绑定本机的 API（8787）；退出会停止三个进程。端口需保持空闲。Key 只由 Node 服务读取，不会加入前端打包文件。

默认使用 Groq 的 OpenAI-compatible Chat Completions 流式接口与 `openai/gpt-oss-120b`。可通过 `AI_BASE_URL`、`AI_MODEL` 换成兼容服务；Gemini 原生接口不在此适配范围内。选择模型时需确认其当前额度和访问资格，详见 [API 调研](research/free-llm-apis.md)。服务不会自动转付费模型。没有 Key 时会显示配置提示，不能生成真实页面。

## 使用

1. 从示例工作台点击「AI 生成页面」，输入布局、配色和交互需求。
2. 生成过程中展开代码区查看输出，可随时停止。
3. 收到完整 `App.tsx` / `styles.css` 后，在独立预览中编译；成功后显示新版本。
4. 默认切换到「修改当前代码」，继续输入修改要求；也可选择「生成新页面」。修改基于最近完整生成的文件，包括需要修复的版本。

会话仅保留在当前页面内，刷新或离开 AI Studio 会清空。当前限定两个文件、React 与普通 CSS，暂不支持任意 npm 包、后端代码、自动修复或源码手动编辑。遇到编译错误可根据错误提示发送修改需求。每次成功更新会重建页面，页面内部交互状态会重置。

## 部署

GitHub Pages 只能托管静态页面，不能运行 `/api/generate`。默认静态构建仍可浏览 AI Studio，但在未配置独立预览服务时禁用生成。

部署时需准备两个独立来源：

- 工作台：构建时设置 `VITE_AI_PREVIEW_URL=https://preview.example.net/ai-preview.html`。将 `/api/generate` 反向代理至 `npm run start:ai` 的本机 8787 端口，关闭响应缓冲，支持至少 120 秒流式请求。设置服务端 `AI_HOST_ORIGIN=https://app.example.com`，与用户地址精确一致。
- 预览站：构建时设置 `VITE_AI_HOST_ORIGIN=https://app.example.com`，将构建出的 `page/ai-preview.html` 与其 `page/assets/` 部署到专用预览来源。不代理 AI API，不存放账号会话、Key 或其他敏感信息，不与主应用共享域 Cookie。生产建议使用不同站点域名；本地仅用不同端口隔离 origin。

预览沿用组件的同源内部 iframe，但整个预览应用运行在与工作台不同的 origin，外层 iframe 禁止顶层导航及弹窗；通信检查 source、origin、消息类型与版本。主站若使用 COEP，预览站也需配置兼容的 COEP/COOP 头及 `Cross-Origin-Resource-Policy: cross-origin`（本地启动已配置）。这是宿主数据隔离，不是无限资源或网络沙箱；公共服务还应在部署层限制预览站网络策略及滥用。不要在预览来源加载敏感会话。

Node API 检查 Origin、JSON 类型、请求大小，限制每进程每分钟 10 次请求、最多 2 个并发、120 秒超时。公网部署还必须在反向代理/网关增加用户鉴权、持久化配额与分布式限流；Origin 检查不能替代身份认证。API 不返回供应商原始错误或 Key。上游 429 显示额度提示并传递 Retry-After，用户手动重试，不自动消耗更多额度。

## 验证

`npm run check` 包括协议与服务端测试、已有组件测试、构建及真实 npm tarball 消费验证。协议测试覆盖 UTF-8/CRLF 任意拆包、截断和文件格式；API 测试覆盖来源、输入、额度响应和断开取消。真实供应商的可达性、速度和生成质量需提供有效 Key 后验证。
