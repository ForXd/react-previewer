// utils/FileProcessor.ts
import { CodeTransformer } from '../../compiler/CodeTransformer';
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

  async initialize(): Promise<void> {
    await this.codeTransformer.initialize();
  }

  async processFiles(
    files: Record<string, string>,
    depsInfo: Record<string, string>
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
        advancedResult.dependencies
      );

      logger.debug('transformed', transformed);

      // 直接返回 transform 阶段的 Map<fileName, blobUrl>
      return transformed;
    } catch (error) {
      logger.error('Error processing files:', error);
      throw error;
    }
  }

  // private createBlobUrls(files: Map<string, string>): Map<string, string> {
  //   const urls = new Map<string, string>();

  //   files.forEach((content, fileName) => {
  //     const mimeType = this.getMimeType(fileName);
  //     const blob = new Blob([content], { type: mimeType });
  //     const url = URL.createObjectURL(blob);
  //     urls.set(fileName, url);
  //     this.blobUrls.set(fileName, url);
  //   });

  //   return urls;
  // }

  // private getMimeType(fileName: string): string {
  //   const ext = fileName.split('.').pop()?.toLowerCase();
  //   switch (ext) {
  //     case 'js':
  //     case 'jsx':
  //     case 'ts':
  //     case 'tsx':
  //       return 'application/javascript';
  //     case 'css':
  //       return 'text/css';
  //     case 'json':
  //       return 'application/json';
  //     default:
  //       return 'text/plain';
  //   }
  // }

  async cleanup(): Promise<void> {
    // 清理 CodeTransformer 的资源
    if (this.blobUrls.size > 0) {
      this.codeTransformer.cleanup(this.blobUrls);
      this.blobUrls.clear();
    }
  }
}