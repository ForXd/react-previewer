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
      const initSwc = await import('@swc/wasm-web');

      // 解析为 AST
      const ast = await initSwc.parseSync(content, {
        syntax: 'typescript',
        tsx: true,
        decorators: true,
        dynamicImport: true,
      });

      console.log('origin ast', ast)

      // 如果提供了选项，则处理 AST（添加调试信息和处理导入）
      if (options) {
        this.astProcessorManager.traverseAndProcess(ast, content, options);
      }

      // 将修改后的 AST 打印回代码
      const modifiedCode = await initSwc.print(ast, {
        minify: false,
      });

      // 转换代码
      const result = await initSwc.transform(modifiedCode.code, {
        filename: fileName,
        jsc: {
          parser: {
            syntax: fileName.endsWith('.ts') || fileName.endsWith('.tsx') ? 'typescript' : 'ecmascript',
            tsx: fileName.endsWith('.tsx') || fileName.endsWith('.jsx'),
            decorators: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              importSource: 'https://esm.sh/react@18.2.0',
            },
          },
          target: 'es2020',
        },
        module: {
          type: 'es6',
        },
      });

      return result.code;
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