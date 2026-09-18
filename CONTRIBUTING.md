# 贡献与工程约定

## 开发流程

1. 从最新 `main` 创建 `codex/` 分支，修改前检查当前 worktree 状态。
2. 使用 `.node-version` 中的 Node，执行 `npm ci`；依赖升级同时提交 `package.json` 和 `package-lock.json`。
3. 公共行为变化补充能覆盖调用场景的回归测试，并同步 README / 类型说明。
4. 执行 `npm run check`。demo 构建发生变化时，先提交全部 `page/` 产物，再执行 `npm run check:page`；该检查也会检测新增的哈希文件。
5. 推送分支并提交 PR 到 `main`，说明最终行为、验证结果与兼容性影响。

目录与模块边界见 [DESIGN.md](./DESIGN.md)。库入口只公开稳定的预览 API，demo 交互留在 `src/demo/`。编译和资源生命周期变更应覆盖过期任务、重试与卸载；新增编译器通过现有 adapter 扩展。

## 工具与规范

- `.editorconfig` 统一 UTF-8、LF 和两空格缩进；`.gitattributes` 标记生成的 `page/`，方便 PR 审阅源码。
- ESLint 覆盖 TS / TSX、工程 `.mjs` 脚本和 JS 配置，警告也会令 CI 失败。
- `npm run typecheck` 检查源码和两个 Vite 配置；`npm run build:lib` 生成类型声明。
- `package.json.files` 是发包白名单。`package:pack` 检查必要入口、许可证及文件范围；`.artifacts/` 和 `dist/` 都不进 Git。
- 常规 `npm pack` / `npm publish` 会通过 `prepack` 构建库。CI 已构建并验证产物，因此打包和发布 tarball 时显式跳过生命周期脚本，避免发布前再次改变产物。
- Dependabot 每周更新 npm 和 GitHub Actions，不自动合并；Babel / React 主版本、TypeScript 兼容别名和定向 override 需要人工核对。

## CI 与部署

`validate.yml` 同时支持 PR 和被其他工作流调用：

1. Node 24 / React 19 和 Node 22 / React 18 各运行源代码验证。Node 24 负责生成唯一的发布候选包。
2. 构建 demo 后检查 `page/` 是否与 Git 中的文件一致。只有 `main` 才上传 Pages artifact。
3. 四组 Node 22/24 × React 18/19 消费者从 npm tarball 安装，验证包名导入、公共类型、CSS、worker 和 ESM/CJS 渲染。
4. 固定的 `Required checks` 汇总所有任务结果，失败、取消或跳过都不能当成成功。

`main` 合并、版本 tag 或手动触发 `npm-publish.yml` 时，先复用同一套验证，再分别进行发布和 Pages 部署。Pages 使用已验证的 artifact；无独立的免验证部署入口。PR 新提交会取消旧验证，生产发布和部署串行执行。

工作流设置超时，Actions 使用完整 commit SHA。PR 验证只有读取权限；OIDC 权限仅交给 npm 发布与 Pages 部署，GitHub Release 单独使用写入权限，checkout 不持久化凭据。

建议仓库管理员在 `main` Ruleset 中启用：PR 合并、`Required checks` 必须通过、禁止强推和删除主干。当前仓库的 main Ruleset 为 disabled（2026-09-05 核对），提交工作流本身不会启用这些仓库级规则。多人协作时可再启用 CODEOWNERS review；单维护者仓库避免要求自己无法批准的 review。

## 版本与发布恢复

发布新版本时，使用 `npm version patch --no-git-tag-version`（或明确的 minor / major），同时更新锁文件，重建并提交 demo 的版本展示。工程或文档改动可以不增加包版本；合并同一版本时会跳过 npm 发布。

- 主干提交的新稳定版本自动发到 npmjs.com。tag 必须与 `package.json` 一致，且提交已经存在于 `main`。
- npm Trusted Publisher 绑定 `ForXd/react-previewer` 的 **npm-publish.yml**；改名必须同步 npm 设置。
- 发布 tarball 与测试 tarball 相同。发布后有界重试查询 npm，并比对 SHA-512 完整性，避免 CDN 尚未同步就宣告整个流程完成。
- 重试已经发布的版本时，GitHub Release 使用 npm 记录的原始 `gitHead`，避免错误地关联到之后的主干合并提交。
- 认证失败时检查 Trusted Publisher 的仓库、工作流文件名、直接 publish 权限和 OIDC。版本已上传时不要为了重试而重复递增版本；修复问题后重跑工作流。
- npmjs.com、GitHub Packages、GitHub Release、GitHub Pages 分别承担包分发、另一套包 registry、版本记录和静态示例站点职责，详见 README。

## 维护验证

```bash
npm run check
npm run test:package -- --react 18.3.1
npm audit --registry=https://registry.npmjs.org --audit-level=low
```

浏览器行为的变更还需要回归 Babel / Rspack、错误恢复、源码定位、主题及移动布局。公共 CDN 网络异常与本地逻辑失败分开记录；单元测试保持不依赖外网。
