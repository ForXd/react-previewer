import type { FileProcessor, TransformOptions } from '../types';
import { ASTProcessorManager, JSXDebugProcessor, ImportProcessor } from '../ast/processors';

export class CSSProcessor implements FileProcessor {
  canProcess(fileName: string): boolean {
    return fileName.endsWith('.css');
  }

  async process(content: string, fileName: string): Promise<string> {
    if (content) {
      return `
        const style = document.createElement('style');
        style.setAttribute('data-path', '${fileName}');
        style.innerHTML = ${JSON.stringify(content)};
        document.head.appendChild(style);
      `;
    }
    const response = await fetch(fileName);
    const css = await response.text();
    return this.process(fileName, css);
  }
}

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
    const processor = this.processors.find(p => p.canProcess(fileName));
    
    if (processor) {
      // 检查处理器是否支持选项参数
      if (processor instanceof TypeScriptProcessor) {
        return await processor.process(content, fileName, options);
      }
      return await processor.process(content, fileName);
    }
    
    return content; // 返回原始内容
  }
}