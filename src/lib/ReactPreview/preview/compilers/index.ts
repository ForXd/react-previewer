import { BabelPreviewCompiler } from './babelCompiler';
import {
  isPreviewCompiler,
  normalizePreviewCompilerConfig,
  type PreviewCompiler,
  type PreviewCompileResult,
  type PreviewCompilerLike
} from './types';

export function createPreviewCompiler(compiler?: PreviewCompilerLike): PreviewCompiler {
  if (isPreviewCompiler(compiler)) {
    return compiler;
  }

  const config = normalizePreviewCompilerConfig(compiler);

  if (config.type === 'rspack-browser') {
    return new LazyRspackBrowserPreviewCompiler(config.rspack);
  }

  return new BabelPreviewCompiler();
}

class LazyRspackBrowserPreviewCompiler implements PreviewCompiler {
  private options: NonNullable<ReturnType<typeof normalizePreviewCompilerConfig>['rspack']>;
  private compilerPromise: Promise<PreviewCompiler> | null = null;

  constructor(options: ReturnType<typeof normalizePreviewCompilerConfig>['rspack'] = {}) {
    this.options = options;
  }

  async compile(input: Parameters<PreviewCompiler['compile']>[0]): Promise<PreviewCompileResult> {
    const compiler = await this.getCompiler();
    return compiler.compile(input);
  }

  async cleanup(result?: PreviewCompileResult): Promise<void> {
    if (!this.compilerPromise) return;
    const compiler = await this.compilerPromise;
    await compiler.cleanup?.(result);
  }

  private async getCompiler(): Promise<PreviewCompiler> {
    if (!this.compilerPromise) {
      this.compilerPromise = import('./rspackBrowser').then(({ RspackBrowserPreviewCompiler }) => (
        new RspackBrowserPreviewCompiler(this.options)
      ));
    }

    return this.compilerPromise;
  }
}

export { BabelPreviewCompiler } from './babelCompiler';
export type {
  PreviewCompiler,
  PreviewCompilerConfig,
  PreviewCompilerLike,
  PreviewCompilerType,
  PreviewCompileInput,
  PreviewCompileResult,
  RspackBrowserCompileOptions
} from './types';
export { getPreviewCompilerConfigKey } from './types';
