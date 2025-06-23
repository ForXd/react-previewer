import type { FileProcessor, TransformOptions } from '../types';
import { ASTProcessorManager, JSXDebugProcessor, ImportProcessor } from '../ast/processors';
import { CompilerManager } from '../CompilerManager';

export class TypeScriptProcessor implements FileProcessor {
  private astProcessorManager: ASTProcessorManager;
  private compilerManager: CompilerManager;

  constructor(compilerManager: CompilerManager) {
    this.astProcessorManager = new ASTProcessorManager();
    this.compilerManager = compilerManager;
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
      // 首先进行 AST 处理（添加调试信息、处理导入等）
      let processedContent = this.astProcessorManager.traverseAndProcess(
        content,
        content,
        { ...options, filename: fileName }
      );

      // 然后使用编译管理器进行代码转换
      processedContent = await this.compilerManager.transform(processedContent, {
        ...options,
        filename: fileName
      });

      return processedContent;
    } catch (error) {
      throw new Error(`Failed to transform ${fileName}: ${error}`);
    }
  }
}

export class FileProcessorManager {
  private processors: FileProcessor[] = [];
  private compilerManager: CompilerManager;

  constructor(compilerManager: CompilerManager) {
    this.compilerManager = compilerManager;
  }

  addProcessor(processor: FileProcessor): void {
    this.processors.push(processor);
  }

  async processFile(content: string, fileName: string, options?: TransformOptions): Promise<string> {
    // 按顺序应用所有匹配的处理器
    let processedContent = content;
    
    for (const processor of this.processors) {
      if (processor.canProcess(fileName)) {
        if (processor instanceof TypeScriptProcessor) {
          processedContent = await processor.process(processedContent, fileName, options);
        } else {
          processedContent = await processor.process(processedContent, fileName);
        }
      }
    }
    
    return processedContent;
  }
}