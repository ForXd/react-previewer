// utils/FileProcessor.ts
import { CodeTransformer } from '../../compiler/CodeTransformer';
import { transformDepsToEsmLinks } from '../DependencyResolver';
import { DEFAULT_DEPENDENCIES, TRANSFORM_OPTIONS } from '../constant';

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
    // 清理之前的 blob URLs
    this.cleanup();

    const advancedResult = transformDepsToEsmLinks(
      { ...DEFAULT_DEPENDENCIES, ...depsInfo },
      TRANSFORM_OPTIONS
    );

    const transformed = await this.codeTransformer.transformFiles(
      files,
      advancedResult.dependencies
    );

    console.log('transformed', transformed);

    // 直接返回 transform 阶段的 Map<fileName, blobUrl>
    return transformed;
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

  cleanup(): void {
    this.blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this.blobUrls.clear();
  }
}