/** @vitest-environment jsdom */
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IsolatedPreview } from '../src/demo/ai/IsolatedPreview';
const url = 'https://preview.example.net/ai-preview.html';
const files = {
  'App.tsx': 'export default function App() {return null}',
  'styles.css': ''
};
afterEach(cleanup);
function send(
  frame: HTMLIFrameElement,
  data: unknown,
  origin = 'https://preview.example.net'
) {
  act(() =>
    window.dispatchEvent(
      new MessageEvent('message', { source: frame.contentWindow, origin, data })
    )
  );
}
describe('isolated AI preview', () => {
  it('validates origin and only switches frames after readiness; errors retain the previous page', () => {
    const onReady = vi.fn();
    const onError = vi.fn();
    const first = { id: 1, files };
    const { rerender } = render(
      <IsolatedPreview
        snapshot={first}
        url={url}
        onReady={onReady}
        onError={onError}
      />
    );
    const frame = screen.getByTitle('正在验证新页面') as HTMLIFrameElement;
    send(frame, { type: 'ai-preview-ready', id: 1 }, 'https://evil.example');
    expect(onReady).not.toHaveBeenCalled();
    send(frame, { type: 'ai-preview-ready', id: 999 });
    expect(onReady).not.toHaveBeenCalled();
    send(frame, { type: 'ai-preview-ready', id: 1 });
    expect(screen.getByTitle('AI 生成页面预览')).toBe(frame);
    rerender(
      <IsolatedPreview
        snapshot={{ id: 2, files }}
        url={url}
        onReady={onReady}
        onError={onError}
      />
    );
    expect(screen.getByTitle('AI 生成页面预览')).toBe(frame);
    const candidate = screen.getByTitle('正在验证新页面') as HTMLIFrameElement;
    send(candidate, { type: 'ai-preview-error', id: 2, message: 'bad render' });
    expect(onError).toHaveBeenCalledWith('bad render');
    expect(screen.getByTitle('AI 生成页面预览')).toBe(frame);
    expect(screen.queryByRole('status')).toBeNull();
  });
});
