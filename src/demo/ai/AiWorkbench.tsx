import { useCallback, useEffect, useRef, useState } from 'react';
import { readGeneration, type GeneratedFiles } from './protocol';
import { IsolatedPreview } from './IsolatedPreview';
import './ai.css';

const suggestions = [
  '一个浅色的项目管理仪表盘，包含统计卡片、任务列表和筛选按钮',
  '一家独立咖啡店的介绍页，暖色调，包含菜单和营业时间'
];
function previewUrl() {
  const value = import.meta.env.VITE_AI_PREVIEW_URL;
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) &&
      url.origin !== window.location.origin
      ? url.href
      : '';
  } catch {
    return '';
  }
}

export default function AiWorkbench() {
  const [prompt, setPrompt] = useState('');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<GeneratedFiles | null>(null);
  const [snapshot, setSnapshot] = useState<{
    id: number;
    files: GeneratedFiles;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'new' | 'edit'>('new');
  const [mobile, setMobile] = useState(false);
  const request = useRef<{ id: number; controller: AbortController } | null>(
    null
  );
  const serial = useRef(0);
  const url = previewUrl();
  useEffect(() => () => request.current?.controller.abort(), []);
  const reportPreviewReady = useCallback(() => {
    setNotice('预览已更新，可以继续输入修改需求。');
    setError('');
  }, []);
  const reportPreviewError = useCallback(
    (message: string) => setError(`预览失败：${message}`),
    []
  );
  const stop = () => {
    request.current?.controller.abort();
    request.current = null;
    setBusy(false);
    setNotice('已停止生成，保留上一版页面');
  };
  async function generate() {
    if (!prompt.trim() || busy || !url) return;
    request.current?.controller.abort();
    const id = ++serial.current;
    const controller = new AbortController();
    request.current = { id, controller };
    setBusy(true);
    setError('');
    setNotice('正在连接模型…');
    setText('');
    const timer = window.setTimeout(() => controller.abort(), 120_000);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          prompt,
          ...(mode === 'edit' && files ? { files } : {})
        })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || '生成服务未启动，请使用 npm run dev:ai');
      }
      if (
        !response.body ||
        !response.headers.get('content-type')?.includes('text/event-stream')
      )
        throw new Error('生成服务响应无效，请确认 API 已正确部署');
      const next = await readGeneration(response.body, (value) => {
        if (request.current?.id !== id) return;
        setText(value);
        setNotice('正在生成代码…');
      });
      if (request.current?.id !== id) return;
      setFiles(next);
      setSnapshot({ id, files: next });
      setMode('edit');
      setNotice('代码已生成，正在验证预览。可继续输入修改需求。');
    } catch (failure) {
      if (request.current?.id !== id) return;
      setError(
        controller.signal.aborted
          ? '生成超时，请重试'
          : failure instanceof Error
            ? failure.message
            : '生成失败'
      );
      setNotice('已保留上一版页面');
    } finally {
      clearTimeout(timer);
      if (request.current?.id === id) {
        request.current = null;
        setBusy(false);
      }
    }
  }
  return (
    <div className="ai-app">
      <header className="ai-header">
        <a href="#">← 示例工作台</a>
        <strong>
          React Previewer <span>AI Studio</span>
        </strong>
        <span className="ai-session">当前会话</span>
      </header>
      <main className="ai-layout">
        <section className="ai-controls" aria-label="AI 页面生成">
          <span className="ai-eyebrow">想法，变成页面</span>
          <h1>描述你的下一个界面。</h1>
          <p className="ai-intro">
            输入需求，查看生成过程，再通过对话调整页面。
          </p>
          {!url && (
            <div className="ai-setup" role="status">
              启动本地体验：配置 .env.ai 中的 AI_API_KEY，再运行 npm run
              dev:ai。在线部署需配置独立预览地址 VITE_AI_PREVIEW_URL。
            </div>
          )}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void generate();
            }}
          >
            <label htmlFor="ai-prompt">页面需求</label>
            <textarea
              id="ai-prompt"
              value={prompt}
              maxLength={4000}
              required
              rows={6}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="例如：设计一个读书记录页面，有书架、阅读进度和添加书籍按钮…"
            />
            <div className="ai-form-options">
              <label htmlFor="ai-mode">生成方式</label>
              <select
                id="ai-mode"
                value={mode}
                disabled={busy}
                onChange={(event) =>
                  setMode(event.target.value as 'new' | 'edit')
                }
              >
                <option value="new">生成新页面</option>
                <option value="edit" disabled={!files}>
                  修改当前代码
                </option>
              </select>
            </div>
            <div className="ai-actions">
              <button
                className="ai-primary"
                disabled={busy || !url || !prompt.trim()}
                type="submit"
              >
                {busy
                  ? '生成中…'
                  : mode === 'edit'
                    ? '应用修改 →'
                    : '生成页面 →'}
              </button>
              {busy && (
                <button type="button" onClick={stop}>
                  停止
                </button>
              )}
            </div>
          </form>
          {!files && (
            <div className="ai-suggestions">
              <span>试试这些需求</span>
              {suggestions.map((suggestion) => (
                <button key={suggestion} onClick={() => setPrompt(suggestion)}>
                  {suggestion} ↗
                </button>
              ))}
            </div>
          )}
          <p role="status" className="ai-notice">
            {notice}
          </p>
          {error && (
            <div role="alert" className="ai-error">
              {error}
            </div>
          )}
          <details className="ai-code" open={busy}>
            <summary>生成代码{busy ? ' · 实时更新' : ''}</summary>
            <pre aria-label="模型生成内容">
              {text || '生成的源代码会显示在这里。'}
            </pre>
          </details>
        </section>
        <section className="ai-result" aria-label="生成结果">
          <div className="ai-result-bar">
            <strong>页面预览</strong>
            <button onClick={() => setMobile(!mobile)} aria-pressed={mobile}>
              {mobile ? '切换桌面宽度' : '切换手机宽度'}
            </button>
          </div>
          <div className={mobile ? 'ai-canvas ai-canvas--mobile' : 'ai-canvas'}>
            <IsolatedPreview
              snapshot={snapshot}
              url={url}
              onError={reportPreviewError}
              onReady={reportPreviewReady}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
