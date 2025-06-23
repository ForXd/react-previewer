// utils/FileProcessor.ts
import { CodeTransformer } from '../../compiler/CodeTransformer';
import type { CompilerType } from '../../compiler/types';
import { transformDepsToEsmLinks } from '../DependencyResolver';
import { DEFAULT_DEPENDENCIES, TRANSFORM_OPTIONS } from '../constant';
import { createModuleLogger } from './Logger';

const logger = createModuleLogger('FileProcessor');

export class FileProcessor {
  private codeTransformer: CodeTransformer;
  private blobUrls: Map<string, string> = new Map();

  constructor() {
    this.codeTransformer = new CodeTransformer();
  }

  async initialize(compilerType?: CompilerType): Promise<void> {
    await this.codeTransformer.initialize(compilerType);
  }

  async processFiles(
    files: Record<string, string>,
    depsInfo: Record<string, string>,
    compilerType?: CompilerType
  ): Promise<Map<string, string>> {
    try {
      // 清理之前的 blob URLs
      await this.cleanup();

      const advancedResult = transformDepsToEsmLinks(
        { ...DEFAULT_DEPENDENCIES, ...depsInfo },
        TRANSFORM_OPTIONS
      );

      const transformed = await this.codeTransformer.transformFiles(
        files,
        advancedResult.dependencies,
        compilerType
      );

      logger.debug('transformed', transformed);

      // 直接返回 transform 阶段的 Map<fileName, blobUrl>
      return transformed;
    } catch (error) {
      logger.error('Error processing files:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    // 清理 CodeTransformer 的资源
    if (this.blobUrls.size > 0) {
      this.codeTransformer.cleanup(this.blobUrls);
      this.blobUrls.clear();
    }
  }
}