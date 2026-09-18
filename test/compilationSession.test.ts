import { describe, expect, it, vi } from 'vitest';
import { CompilationSession } from '../src/lib/ReactPreview/preview/runtime/CompilationSession';
import { getPreviewCompilerConfigKey } from '../src/lib/ReactPreview/preview/compilers/types';
import type { PreviewCompileResult } from '../src/lib/ReactPreview';

const input = {
  entryFile: 'App.tsx',
  files: { 'App.tsx': 'export default () => null' },
  depsInfo: {}
};
const result = (name: string): PreviewCompileResult => ({
  entryFile: 'App.tsx',
  fileUrls: new Map([['App.tsx', `blob:${name}`]]),
  transformedFiles: 1,
  cleanup: vi.fn()
});
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

describe('CompilationSession ownership', () => {
  it('serializes work, releases obsolete results, and publishes only the latest request', async () => {
    const pending = deferred<PreviewCompileResult>();
    const old = result('old');
    const newest = result('new');
    const compile = vi
      .fn()
      .mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce(newest);
    const compiler = { compile, initialize: vi.fn(), cleanup: vi.fn() };
    const session = new CompilationSession();
    const first = session.compile(input, compiler);
    await vi.waitFor(() => expect(compile).toHaveBeenCalledOnce());
    const second = session.compile(input, compiler);
    const third = session.compile(input, compiler);
    expect(compile).toHaveBeenCalledOnce();
    pending.resolve(old);
    expect(await first).toBeNull();
    expect(await second).toBeNull();
    expect(await third).toBe(newest);
    expect(old.cleanup).toHaveBeenCalledOnce();
    expect(newest.cleanup).not.toHaveBeenCalled();
    expect(compiler.initialize).toHaveBeenCalledOnce();
    await session.dispose();
    await session.dispose();
    expect(newest.cleanup).toHaveBeenCalledOnce();
    expect(compiler.cleanup).toHaveBeenCalledOnce();
  });

  it('releases late results after unmount and prevents queued work from starting', async () => {
    const pending = deferred<PreviewCompileResult>();
    const late = result('late');
    const compiler = {
      compile: vi.fn(() => pending.promise),
      cleanup: vi.fn()
    };
    const session = new CompilationSession();
    const first = session.compile(input, compiler);
    await vi.waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    const queued = session.compile(input, compiler);
    await session.dispose();
    expect(compiler.cleanup).toHaveBeenCalledOnce();
    pending.resolve(late);
    expect(await first).toBeNull();
    expect(await queued).toBeNull();
    expect(late.cleanup).toHaveBeenCalledOnce();
    expect(compiler.compile).toHaveBeenCalledOnce();
  });

  it('recognizes adapter replacement and cleans the result through its owning adapter', async () => {
    const firstResult = { ...result('first'), cleanup: undefined };
    const firstCompiler = {
      compile: vi.fn(async () => firstResult),
      cleanup: vi.fn()
    };
    const secondCompiler = {
      compile: vi.fn(async () => result('second')),
      cleanup: vi.fn()
    };
    const session = new CompilationSession();
    await session.compile(input, firstCompiler);
    await session.compile(input, secondCompiler);
    expect(firstCompiler.cleanup.mock.calls).toEqual([[firstResult], []]);
    expect(secondCompiler.compile).toHaveBeenCalledOnce();
    await session.dispose();
  });

  it('recovers after failed initialization without poisoning later compilations', async () => {
    const compiler = {
      initialize: vi
        .fn()
        .mockRejectedValueOnce(new Error('temporary'))
        .mockResolvedValue(undefined),
      compile: vi.fn(async () => result('recovered'))
    };
    const session = new CompilationSession();
    await expect(session.compile(input, compiler)).rejects.toThrow('temporary');
    expect(await session.compile(input, compiler)).not.toBeNull();
    expect(compiler.initialize).toHaveBeenCalledTimes(2);
    await session.dispose();
  });

  it('invalidates a running result before the next debounce has elapsed', async () => {
    const pending = deferred<PreviewCompileResult>();
    const stale = result('stale');
    const compiler = { compile: vi.fn(() => pending.promise) };
    const session = new CompilationSession();
    const task = session.compile(input, compiler);
    await vi.waitFor(() => expect(compiler.compile).toHaveBeenCalledOnce());
    session.invalidate();
    pending.resolve(stale);
    expect(await task).toBeNull();
    expect(stale.cleanup).toHaveBeenCalledOnce();
    await session.dispose();
  });

  it('includes worker factory identity while keeping equivalent option objects stable', () => {
    const workerFactory = () => ({}) as Worker;
    expect(
      getPreviewCompilerConfigKey({
        type: 'rspack-browser',
        rspack: { workerFactory }
      })
    ).toBe(
      getPreviewCompilerConfigKey({
        type: 'rspack-browser',
        rspack: { workerFactory }
      })
    );
    expect(
      getPreviewCompilerConfigKey({
        type: 'rspack-browser',
        rspack: { workerFactory }
      })
    ).not.toBe(
      getPreviewCompilerConfigKey({
        type: 'rspack-browser',
        rspack: { workerFactory: () => ({}) as Worker }
      })
    );
  });

  it('retries initialization when an obsolete initialization rejects', async () => {
    const pending = deferred<void>();
    const compiler = {
      initialize: vi.fn().mockReturnValueOnce(pending.promise).mockResolvedValue(undefined),
      compile: vi.fn(async () => result('recovered'))
    };
    const session = new CompilationSession();
    const obsolete = session.compile(input, compiler);
    await vi.waitFor(() => expect(compiler.initialize).toHaveBeenCalledOnce());
    const current = session.compile(input, compiler);
    pending.reject(new Error('temporary startup failure'));
    expect(await obsolete).toBeNull();
    expect(await current).not.toBeNull();
    expect(compiler.initialize).toHaveBeenCalledTimes(2);
    await session.dispose();
  });

});
