/** @vitest-environment jsdom */
import { StrictMode } from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReactPreviewer, type PreviewStatus } from '../src/lib/ReactPreview';

const files = { 'App.tsx': 'export default () => <main>Hello</main>' };
const result = () => ({
  entryFile: 'App.tsx',
  fileUrls: new Map([['App.tsx', 'blob:entry']]),
  transformedFiles: 1,
  cleanup: vi.fn()
});
const iframe = () => screen.getByTitle('React preview') as HTMLIFrameElement;
function post(
  type: string,
  data: unknown = {},
  source: Window | null = iframe().contentWindow
) {
  act(() =>
    window.dispatchEvent(
      new MessageEvent('message', { source, data: { type, data } })
    )
  );
}
afterEach(cleanup);

describe('ReactPreviewer lifecycle through the public interface', () => {
  it('does not recompile for equivalent files, callback, style, route or inspection updates', async () => {
    const compiler = { compile: vi.fn(async () => result()) };
    const firstCallback = vi.fn();
    const nextCallback = vi.fn();
    const { rerender } = render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        onStatusChange={firstCallback}
      />
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    const frame = iframe();
    rerender(
      <ReactPreviewer
        files={{ ...files }}
        compiler={compiler}
        compileDelay={0}
        onStatusChange={nextCallback}
        className="new-skin"
        initialPath="/projects?sort=name#active"
        isInspecting
      />
    );
    post('preview-ready', { resourceTotal: 2, resourceLoaded: 2 });
    expect(iframe()).toBe(frame);
    expect(nextCallback).toHaveBeenLastCalledWith(
      expect.objectContaining({ phase: 'ready' })
    );
    expect(compiler.compile).toHaveBeenCalledOnce();
    expect(firstCallback).not.toHaveBeenLastCalledWith(
      expect.objectContaining({ phase: 'ready' })
    );
  });

  it('recompiles when replacing a custom compiler even with identical source', async () => {
    const first = { compile: vi.fn(async () => result()) };
    const second = { compile: vi.fn(async () => result()) };
    const { rerender } = render(
      <ReactPreviewer files={files} compiler={first} compileDelay={0} />
    );
    await waitFor(() => expect(first.compile).toHaveBeenCalledOnce());
    rerender(
      <ReactPreviewer files={files} compiler={second} compileDelay={0} />
    );
    await waitFor(() => expect(second.compile).toHaveBeenCalledOnce());
  });

  it('keeps errors authoritative over late ready/resource messages and recovers on edit', async () => {
    const compiler = { compile: vi.fn(async () => result()) };
    const onStatusChange = vi.fn<(status: PreviewStatus) => void>();
    const { rerender } = render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        onStatusChange={onStatusChange}
      />
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    post('runtime-error', { message: 'render failed' });
    post('preview-ready');
    post('resource-status', { phase: 'loading-css' });
    expect(screen.getByRole('alert').textContent).toContain('render failed');
    expect(onStatusChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ phase: 'error', isLoading: false })
    );
    const staleWindow = iframe().contentWindow;
    rerender(
      <ReactPreviewer
        files={{ 'App.tsx': 'export default () => null' }}
        compiler={compiler}
        compileDelay={0}
        onStatusChange={onStatusChange}
      />
    );
    post('runtime-error', { message: 'old frame failed' }, staleWindow);
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledTimes(2));
    post('preview-ready');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(onStatusChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ phase: 'ready', error: null, isLoading: false })
    );
  });

  it('ignores unrelated and malformed messages and accepts only the current iframe', async () => {
    const compiler = { compile: vi.fn(async () => result()) };
    const onError = vi.fn();
    const onRouteChange = vi.fn();
    render(
      <ReactPreviewer
        files={files}
        compiler={compiler}
        compileDelay={0}
        onError={onError}
        onRouteChange={onRouteChange}
      />
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    post('runtime-error', { message: 'foreign error' }, window);
    act(() =>
      window.dispatchEvent(
        new MessageEvent('message', {
          source: iframe().contentWindow,
          data: null
        })
      )
    );
    post('route-change', {
      pathname: '/projects',
      search: '?id=2',
      hash: '#details'
    });
    expect(onError).not.toHaveBeenCalled();
    expect(onRouteChange).toHaveBeenCalledWith({
      pathname: '/projects',
      search: '?id=2',
      hash: '#details',
      href: '/projects?id=2#details'
    });
  });

  it('survives StrictMode effect replay and releases the active result once', async () => {
    const output = result();
    const compiler = { compile: vi.fn(async () => output) };
    const { unmount } = render(
      <StrictMode>
        <ReactPreviewer files={files} compiler={compiler} compileDelay={0} />
      </StrictMode>
    );
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    post('preview-ready');
    expect(screen.queryByRole('status')).toBeNull();
    unmount();
    await waitFor(() => expect(output.cleanup).toHaveBeenCalledOnce());
  });

  it('clears progress and the previous resource name when recompiling', async () => {
    const compiler = { compile: vi.fn(async () => result()) };
    const onStatusChange = vi.fn();
    const { rerender } = render(<ReactPreviewer files={files} compiler={compiler} compileDelay={0} onStatusChange={onStatusChange} />);
    await waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    post('resource-status', { phase: 'loading-css', resourceTotal: 2, resourceLoaded: 1, resourceProgress: 50, currentResource: 'old.css' });
    rerender(<ReactPreviewer files={{ 'App.tsx': 'export default () => null' }} compiler={compiler} compileDelay={0} onStatusChange={onStatusChange} />);
    expect(onStatusChange).toHaveBeenLastCalledWith(expect.objectContaining({ phase: 'compiling', currentResource: undefined, resourceTotal: 0, resourceProgress: 0 }));
  });

});
