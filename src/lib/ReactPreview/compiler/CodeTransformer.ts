import type { FileSystem, TransformOptions } from './types';
import { DependencyGraphBuilder } from './dependency/DependencyGraphBuilder';
import { FileProcessorManager, CSSProcessor, TypeScriptProcessor } from './processors';

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
    // 注册文件处理器
    this.fileProcessorManager.addProcessor(new CSSProcessor());
    this.fileProcessorManager.addProcessor(new TypeScriptProcessor());
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const wasmUrl = new URL('@swc/wasm-web/wasm_bg.wasm', import.meta.url);
    const initSwc = (await import('@swc/wasm-web')).default;
    
    console.log('Initializing SWC...');
    await initSwc(wasmUrl);
    this.initialized = true;
  }

  async transformFiles(files: FileSystem, depsInfo: Record<string, string>): Promise<Map<string, string>> {
    if (!this.initialized) {
      throw new Error('CodeTransformer not initialized');
    }

    console.log('Building dependency graph...');
    
    // 构建依赖图并获取处理顺序
    const dependencyGraph = await this.dependencyGraphBuilder.build(files);
    const processingOrder = dependencyGraph.getProcessingOrder();
    console.log('Processing order:', processingOrder);

    // 按依赖顺序处理文件
    return await this.processFilesInOrder(files, processingOrder, depsInfo);
  }

  private async processFilesInOrder(
    files: FileSystem,
    processingOrder: string[],
    depsInfo: Record<string, string>
  ): Promise<Map<string, string>> {
    const transformedFiles = new Map<string, string>();
    const fileUrls = new Map<string, string>();

    for (const fileName of processingOrder) {
      const fileContent = files[fileName];
      
      if (!fileContent) {
        console.warn(`File not found: ${fileName}`);
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
        // 使用文件处理器管理器处理文件
        processedContent = await this.fileProcessorManager.processFile(
          fileContent, 
          fileName, 
          transformOptions
        );
      } catch (error) {
        console.error(`Failed to process ${fileName}:`, error);
        processedContent = fileContent; // 使用原始内容作为后备
      }

      // 保存转换后的内容并生成 URL
      transformedFiles.set(fileName, processedContent);
      const url = this.createBlobURL(processedContent);
      fileUrls.set(fileName, url);

      console.log(`Processed: ${fileName} -> ${url}`);
    }

    return transformedFiles;
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
    console.log('Cleanup completed');
  }
}