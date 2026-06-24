// utils/FileProcessor.ts
import {
  createPreviewCompiler,
  getPreviewCompilerConfigKey,
  type PreviewCompiler,
  type PreviewCompilerLike,
  type PreviewCompileResult
} from '../compilers';
import { createModuleLogger } from './Logger';
import type { SourceAttributeNameOverrides } from '../sourceAttributes';

const logger = createModuleLogger('FileProcessor');

export class FileProcessor {
  private compiler: PreviewCompiler;
  private compilerKey: string;
  private currentResult: PreviewCompileResult | null = null;

  constructor(compiler?: PreviewCompilerLike) {
    this.compiler = createPreviewCompiler(compiler);
    this.compilerKey = getPreviewCompilerConfigKey(compiler);
  }

  async configure(compiler?: PreviewCompilerLike): Promise<void> {
    const nextKey = getPreviewCompilerConfigKey(compiler);
    if (nextKey === this.compilerKey) {
      return;
    }

    await this.cleanup();
    await this.compiler.cleanup?.();
    this.compiler = createPreviewCompiler(compiler);
    this.compilerKey = nextKey;
  }

  async initialize(): Promise<void> {
    await this.compiler.initialize?.();
  }

  async processFiles(
    files: Record<string, string>,
    depsInfo: Record<string, string>,
    entryFile: string,
    sourceAttributeNames?: SourceAttributeNameOverrides
  ): Promise<PreviewCompileResult> {
    try {
      // 清理之前的 blob URLs
      await this.cleanup();

      const result = await this.compiler.compile({
        files,
        depsInfo,
        entryFile,
        sourceAttributeNames
      });

      logger.debug('transformed', result.fileUrls);
      this.currentResult = result;

      return result;
    } catch (error) {
      logger.error('Error processing files:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.currentResult) {
      const result = this.currentResult;
      if (result.cleanup) {
        result.cleanup();
      } else if (this.compiler.cleanup) {
        await this.compiler.cleanup(result);
      } else {
        for (const url of result.fileUrls.values()) {
          URL.revokeObjectURL(url);
        }
      }
      this.currentResult = null;
    }
  }

  async dispose(): Promise<void> {
    await this.cleanup();
    await this.compiler.cleanup?.();
  }
}
