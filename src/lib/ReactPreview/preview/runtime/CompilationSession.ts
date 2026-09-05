import {
  createPreviewCompiler,
  getPreviewCompilerConfigKey
} from '../compilers';
import type {
  PreviewCompiler,
  PreviewCompilerLike,
  PreviewCompileInput,
  PreviewCompileResult
} from '../compilers';

type OwnedResult = { result: PreviewCompileResult; compiler: PreviewCompiler };

/** Owns one compiler and its results. Only the newest request can be published. */
export class CompilationSession {
  private compiler?: PreviewCompiler;
  private compilerKey?: string;
  private current?: OwnedResult;
  private revision = 0;
  private disposed = false;
  private queue: Promise<unknown> = Promise.resolve();

  invalidate(): void {
    this.revision += 1;
  }

  compile(
    input: PreviewCompileInput,
    config?: PreviewCompilerLike
  ): Promise<PreviewCompileResult | null> {
    const revision = ++this.revision;
    const isCurrent = () => !this.disposed && revision === this.revision;
    const task = this.queue
      .then(async () => {
        if (!isCurrent()) return null;
        const key = getPreviewCompilerConfigKey(config);
        if (!this.compiler || this.compilerKey !== key) {
          const previousCompiler = this.compiler;
          this.compiler = undefined;
          this.compilerKey = undefined;
          await this.releaseCurrent();
          await previousCompiler?.cleanup?.();
          if (!isCurrent()) return null;
          this.compiler = createPreviewCompiler(config);
          this.compilerKey = key;
          await this.compiler.initialize?.();
        }
        if (!isCurrent()) return null;
        const compiler = this.compiler;
        const result = await compiler.compile(input);
        let adopted = false;
        try {
          if (!isCurrent()) return null;
          await this.releaseCurrent();
          if (!isCurrent()) return null;
          this.current = { result, compiler };
          adopted = true;
          return result;
        } finally {
          if (!adopted) await this.release({ result, compiler });
        }
      })
      .catch((error: unknown) => {
        // Retry failed initialization even when that request became obsolete.
        this.compilerKey = undefined;
        if (!isCurrent()) return null;
        throw error;
      });
    // Serializing protects adapters with mutable compilation state. A rejected
    // compile must not poison subsequent requests.
    this.queue = task.catch(() => undefined);
    return task;
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    this.invalidate();
    const compiler = this.compiler;
    this.compiler = undefined;
    try {
      await this.releaseCurrent();
    } finally {
      // Terminate workers immediately; any late result still releases itself.
      await compiler?.cleanup?.();
    }
  }

  private async releaseCurrent(): Promise<void> {
    const current = this.current;
    this.current = undefined;
    if (current) await this.release(current);
  }

  private async release({ result, compiler }: OwnedResult): Promise<void> {
    if (result.cleanup) await result.cleanup();
    else if (compiler.cleanup) await compiler.cleanup(result);
    else
      for (const url of new Set(result.fileUrls.values()))
        URL.revokeObjectURL(url);
  }
}
