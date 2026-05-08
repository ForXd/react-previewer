import type { FileProcessor, TransformOptions } from '../types';
import { ASTProcessorManager, JSXDebugProcessor, ImportProcessor } from '../ast/processors';

export class TypeScriptProcessor implements FileProcessor {
  private astProcessorManager: ASTProcessorManager;

  constructor() {
    this.astProcessorManager = new ASTProcessorManager();
    this.setupASTProcessors();
  }

  private setupASTProcessors(): void {
    this.astProcessorManager.addProcessor(new JSXDebugProcessor());
    this.astProcessorManager.addProcessor(new ImportProcessor());
  }

  canProcess(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['ts', 'tsx', 'jsx'].includes(ext || '');
  }

  async process(content: string, fileName: string, options?: TransformOptions): Promise<string> {
    try {
      // 统一走 traverseAndProcess，保证自动注入 import React
      const transformedCode = this.astProcessorManager.traverseAndProcess(
        content,
        content,
        { ...options, filename: fileName }
      );
      return transformedCode;
    } catch (error) {
      throw new Error(`Failed to transform ${fileName}: ${error}`);
    }
  }
}

export class FileProcessorManager {
  private processors: FileProcessor[] = [];

  addProcessor(processor: FileProcessor): void {
    this.processors.push(processor);
  }

  async processFile(content: string, fileName: string, options?: TransformOptions): Promise<string> {
    let processedContent = content;
    
    for (const processor of this.processors) {
      if (processor.canProcess(fileName)) {
        processedContent = await processor.process(processedContent, fileName, options);
      }
    }
    
    return processedContent;
  }
}
