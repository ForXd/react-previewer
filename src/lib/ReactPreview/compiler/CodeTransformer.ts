import type { FileSystem, TransformOptions } from './types';
import { DependencyGraphBuilder } from './dependency/DependencyGraphBuilder';
import { FileProcessorManager, TypeScriptProcessor } from './processors';
import { createModuleLogger } from '../preview/utils/Logger';

const logger = createModuleLogger('CodeTransformer');

export class CodeTransformer {
  private initialized = false;
  private fileProcessorManager: FileProcessorManager;
  private dependencyGraphBuilder: DependencyGraphBuilder;

  constructor() {
    this.fileProcessorManager = new FileProcessorManager();
    this.dependencyGraphBuilder = new DependencyGraphBuilder();
    
    this.setupProcessors();
  }

  private setupProcessors(): void {
    // 注册文件处理器 - 注意顺序很重要
    this.fileProcessorManager.addProcessor(new TypeScriptProcessor()); // 处理 TypeScript/JSX，包括 CSS 导入
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    // 直接标记为已初始化，不再加载 swc/wasm
    this.initialized = true;
  }

  async transformFiles(files: FileSystem, depsInfo: Record<string, string>): Promise<Map<string, string>> {
    if (!this.initialized) {
      throw new Error('CodeTransformer not initialized');
    }

    logger.info('Building dependency graph...');
    // 构建依赖图并获取处理顺序
    const dependencyGraph = await this.dependencyGraphBuilder.build(files);
    const processingOrder = dependencyGraph.getProcessingOrder();
    logger.debug('Processing order:', processingOrder);

    // 按依赖顺序处理文件，返回 Map<fileName, blobUrl>
    return await this.processFilesInOrder(files, processingOrder, depsInfo);
  }

  private async processFilesInOrder(
    files: FileSystem,
    processingOrder: string[],
    depsInfo: Record<string, string>
  ): Promise<Map<string, string>> {
    const fileUrls = new Map<string, string>();

    for (const fileName of processingOrder) {
      const fileContent = files[fileName];
      if (!fileContent) {
        logger.warn(`File not found: ${fileName}`);
        continue;
      }

      // 准备转换选项
      const transformOptions: TransformOptions = {
        filename: fileName,
        files: files,
        fileUrls,
        depsInfo
      };

      let processedContent: string;
      try {
        processedContent = await this.fileProcessorManager.processFile(
          fileContent, 
          fileName, 
          transformOptions
        );
      } catch (error) {
        logger.error(`Failed to process ${fileName}:`, error);
        throw error;
      }

      // 生成 blob url 并保存
      const url = this.createBlobURL(processedContent);
      fileUrls.set(fileName, url);
      logger.debug(`Processed: ${fileName} -> ${url}`);
    }

    return fileUrls;
  }

  private createBlobURL(content: string): string {
    const blob = new Blob([content], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }

  /**
   * 清理生成的 blob URLs
   */
  cleanup(fileUrls: Map<string, string>): void {
    // 清理所有生成的 blob URLs
    for (const url of fileUrls.values()) {
      URL.revokeObjectURL(url);
    }
    logger.info('Cleanup completed');
  }
}