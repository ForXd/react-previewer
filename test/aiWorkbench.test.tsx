/** @vitest-environment jsdom */
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AiWorkbench from '../src/demo/ai/AiWorkbench';
vi.mock('../src/demo/ai/IsolatedPreview', () => ({
  IsolatedPreview: ({ snapshot }: { snapshot: unknown }) => (
    <output data-testid="ai-snapshot">{JSON.stringify(snapshot)}</output>
  )
}));
const files = {
  'App.tsx': 'export default function App(){return <h1>Test</h1>}',
  'styles.css': ''
};
function response() {
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ choices: [{ delta: { content: JSON.stringify({ files }) }, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`
          )
        );
        controller.close();
      }
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  );
}
afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe('AI workbench session', () => {
  it('generates a snapshot and sends complete context on continued edits', async () => {
    vi.stubEnv(
      'VITE_AI_PREVIEW_URL',
      'https://preview.example.net/ai-preview.html'
    );
    const fetcher = vi
      .fn()
      .mockImplementation(() => Promise.resolve(response()));
    vi.stubGlobal('fetch', fetcher);
    render(<AiWorkbench />);
    fireEvent.change(screen.getByLabelText('页面需求'), {
      target: { value: '做一个页面' }
    });
    fireEvent.click(screen.getByRole('button', { name: '生成页面 →' }));
    await screen.findByRole('button', { name: '应用修改 →' });
    expect(screen.getByTestId('ai-snapshot').textContent).toContain('Test');
    fireEvent.change(screen.getByLabelText('页面需求'), {
      target: { value: '换成蓝色' }
    });
    fireEvent.click(screen.getByRole('button', { name: '应用修改 →' }));
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    expect(JSON.parse(fetcher.mock.calls[1][1].body)).toEqual({
      prompt: '换成蓝色',
      files
    });
  });
  it('cancels a pending request and ignores late responses', async () => {
    vi.stubEnv(
      'VITE_AI_PREVIEW_URL',
      'https://preview.example.net/ai-preview.html'
    );
    let resolve!: (response: Response) => void;
    const fetcher = vi.fn(
      () =>
        new Promise<Response>((done) => {
          resolve = done;
        })
    );
    vi.stubGlobal('fetch', fetcher);
    render(<AiWorkbench />);
    fireEvent.change(screen.getByLabelText('页面需求'), {
      target: { value: 'hi' }
    });
    fireEvent.click(screen.getByRole('button', { name: '生成页面 →' }));
    fireEvent.click(screen.getByRole('button', { name: '停止' }));
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
    resolve(response());
    await waitFor(() =>
      expect(
        screen.getByText('已停止生成，保留上一版页面').textContent
      ).toContain('已停止')
    );
    expect(screen.getByTestId('ai-snapshot').textContent).toBe('null');
  });
  it('disables generation if an isolated preview origin is not configured', () => {
    vi.stubEnv(
      'VITE_AI_PREVIEW_URL',
      window.location.origin + '/ai-preview.html'
    );
    render(<AiWorkbench />);
    fireEvent.change(screen.getByLabelText('页面需求'), {
      target: { value: 'hi' }
    });
    expect(
      (screen.getByRole('button', { name: '生成页面 →' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });
});
