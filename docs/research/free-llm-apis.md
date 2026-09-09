# 免费大模型 API：React 页面生成调研

核验日期：2026-09-09。只核对官方公开资料，未使用 API Key 调用模型，未测试中国大陆网络、代码质量、首 token 延迟或成功率。公开文档和搜索索引可能滞后；最终以账户模型列表、额度和实际响应为准。这里的“免费”指目前存在的免费档，不代表永久承诺。

## 结论与推荐

可以用免费 API 验证“提示词 → 流式 React 代码 → 预览”闭环。建议先用 **Groq 免费档**完成原型，选 `openai/gpt-oss-120b`，并把供应商和模型设为服务端配置；这是基于其公开额度及流式接口作出的工程建议，尚非本项目的质量测评结论。Gemini 作为第二个质量对照，OpenRouter 作模型探索备选，已有 Cloudflare 部署时可考虑 Workers AI。不要把任一家免费额度视作公开生产服务的容量保障。

中国大陆用户不能直接沿用海外推荐：Gemini 官方支持地区没有中国大陆；其余三家的本次资料不足以证明大陆账户与网络可稳定使用。优先从预定部署地区验证账户资格、模型权限和流式可达性。硅基流动可作为国内候选，但本次未核实到足够完整的当前免费强模型报价，不据此承诺免费上线。

## 候选对比

| 服务 | 已核实的免费条件 / 限额 | 流式能力 | 本项目适配判断 |
| --- | --- | --- | --- |
| **Groq** | 免费档 `openai/gpt-oss-120b`：30 请求/分钟、1,000 请求/天、8,000 token/分钟、200,000 token/天；限制按模型和账户变化。[额度](https://console.groq.com/docs/rate-limits) | Chat Completions 设置 `stream: true`，读取增量内容。[接口](https://console.groq.com/docs/text-chat) | 适合先打通单文件 JSX 原型。长系统提示、历史代码和长输出会消耗 token 配额，1,000 请求/天不代表能生成 1,000 个完整页面。 |
| **Gemini Developer API** | 当前报价中 `gemini-3.7-flash` 的标准文本输入、输出有免费档；官方将其定位于日常编码。实际 RPM / TPM / RPD 必须在 AI Studio 查询，不能照搬旧版配额。[价格](https://ai.google.dev/gemini-api/docs/pricing)、[限额](https://ai.google.dev/gemini-api/docs/rate-limits) | 支持 `streamGenerateContent`。[接口](https://ai.google.dev/api/generate-content) | 值得作为代码生成质量对照；没有实测，不声称优于其他模型。仅在支持地区评估。 |
| **OpenRouter** | 免费模型通常以 `:free` 结尾；未达到累计购买 10 美元额度时为 50 请求/天，达到后为 1,000 请求/天。免费使用限制为 20 请求/分钟。购买门槛不是完全零支出。[FAQ](https://openrouter.ai/docs/faq)、[官方限流说明](https://openrouter.zendesk.com/hc/en-us/articles/39501163636379-OpenRouter-Rate-Limits-What-You-Need-to-Know) | 支持 SSE 和 `stream: true`。[FAQ](https://openrouter.ai/docs/faq) | 适合试模型；50 次/天不适合多人演示。可用 `openrouter/free` 自动选免费模型，但为保证生成行为可比较，正式原型应固定经验证的模型。 |
| **Cloudflare Workers AI** | 10,000 Neurons/天，00:00 UTC 重置；免费档超限失败，付费档超出额度收费。Neurons 不是 token，需按模型报价换算。[价格](https://developers.cloudflare.com/workers-ai/platform/pricing/) | AI binding 的 `env.AI.run` 支持 `stream: true`，返回 SSE。[接口](https://developers.cloudflare.com/workers-ai/configuration/bindings/) | 可把推理与服务端代理放在一个 Worker。官方列出 `@cf/zai-org/glm-4.7-flash` 等仍可用于免费档；部分更强模型已要求付费，不能把整个目录都算作免费。[模型访问变更](https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/) |

## 地区和输入数据

- **Gemini**：官方地区清单未列中国大陆；免费档价格表标记输入输出可用于改进 Google 产品。因此原型只使用公开示例与虚构业务内容。[支持地区](https://ai.google.dev/gemini-api/docs/available-regions)、[数据处理标记](https://ai.google.dev/gemini-api/docs/pricing)
- **Groq**：推理内容默认不保留，但系统故障和滥用调查可临时记录，通常最多 30 天；所有客户可启用 ZDR。保留的数据位于美国 GCP。此次没有取得可靠的大陆服务承诺；不要把搜索工具的国家参数误当作 API 支持地区。[数据说明](https://console.groq.com/docs/your-data)
- **OpenRouter**：自身默认不保存提示词和回答，但会保存请求元数据；上游供应商的数据政策还需独立确认。限制训练或保留的路由设置可能减少可用供应商。[数据说明](https://openrouter.ai/docs/guides/privacy/data-collection)、[供应商路由](https://openrouter.ai/docs/guides/routing/provider-selection)
- **Cloudflare**：未经明确同意，不将 Workers AI 客户内容用于训练模型或改进服务；结合 R2、KV 等存储服务时内容可能被保存。模型也有各自许可。该说明不等于中国大陆可达性或数据驻留承诺。[数据说明](https://developers.cloudflare.com/workers-ai/platform/data-usage/)

## 国内候选的证据边界

硅基流动有官方国内注册/API 入门文档和模型中心，但模型中心展示模型不等于该模型免费；历史公告也记录过“限时免费模型开始计费”。本次部分具体限流/报价文档无法读取，故不引用旧博客中的赠金或“永久免费”口号，也不把 Qwen 新模型默认算免费。实施前需要用控制台核对具体模型价格、免费版名称、实名认证条件、RPM/TPM、流式能力及数据条款。[快速上手](https://docs.siliconflow.cn/docs/userguide/quickstart)、[模型中心](https://www.siliconflow.cn/models)、[更新公告](https://docs.siliconflow.cn/docs/release-notes/overview)

## 下一步验证

使用同一组 10 个提示（落地页、表单、仪表盘与修改已有页面），记录首 token 时间、完整耗时、生成 token、一次编译成功率及修复后的成功率。不要只比较生成速度：自动修复也会消耗请求额度。先限制输出为单个 React 组件与组件支持的样式形式，避免生成任意 npm 项目。

实现时由服务端保管 Key 并转发流式输出；页面接收增量文本，保留上次有效预览，直到新代码形成可编译版本后更新。模型适配、错误处理和本仓库预览限制见 [接入方案](./ai-live-preview-design.md)。
