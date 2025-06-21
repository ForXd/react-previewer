import type { FileProcessor, TransformOptions } from '../types';
import { ASTProcessorManager, JSXDebugProcessor, ImportProcessor } from '../ast/processors';

export class CSSImportProcessor implements FileProcessor {
  canProcess(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['ts', 'tsx', 'jsx', 'js'].includes(ext || '');
  }

  async process(content: string, fileName: string, options?: TransformOptions): Promise<string> {
    // 检查是否包含 CSS 导入
    const cssImportRegex = /import\s+['"]([^'"]*\.css)['"];?/g;
    let match;
    let processedContent = content;
    const cssImports: string[] = [];

    while ((match = cssImportRegex.exec(content)) !== null) {
      const cssPath = match[1];
      cssImports.push(cssPath);
    }

    // 如果有 CSS 导入，添加动态加载逻辑
    if (cssImports.length > 0) {
      // 从文件系统中获取 CSS 内容
      const cssContents: Record<string, string> = {};
      const files = options?.files || {};
      
      for (const cssFile of cssImports) {
        // 解析相对路径
        let resolvedPath = cssFile;
        if (cssFile.startsWith('./') || cssFile.startsWith('../')) {
          // 简单的路径解析
          const currentDir = fileName.substring(0, fileName.lastIndexOf('/') + 1);
          resolvedPath = this.resolvePath(currentDir, cssFile);
        }
        
        // 尝试不同的扩展名
        const possiblePaths = [
          resolvedPath,
          `${resolvedPath}.css`,
          resolvedPath.replace(/\.css$/, '') + '.css'
        ];
        
        for (const path of possiblePaths) {
          if (files[path]) {
            cssContents[cssFile] = files[path];
            console.log(`Found CSS file: ${cssFile} -> ${path}`);
            break;
          }
        }
      }

      const cssLoaderCode = `
        // 动态加载 CSS 文件
        (async () => {
          const cssContents = ${JSON.stringify(cssContents)};
          const loadedFiles = new Set();
          
          for (const [cssFile, cssContent] of Object.entries(cssContents)) {
            if (loadedFiles.has(cssFile)) continue;
            
            try {
              console.log('Loading CSS file:', cssFile);
              const style = document.createElement('style');
              style.setAttribute('data-path', cssFile);
              style.innerHTML = cssContent;
              document.head.appendChild(style);
              
              loadedFiles.add(cssFile);
              console.log('CSS file loaded successfully:', cssFile);
            } catch (error) {
              console.warn('Failed to load CSS file:', cssFile, error);
            }
          }
        })();
      `;

      // 用注释替换原始的 CSS 导入语句，保持原始代码结构
      processedContent = processedContent.replace(cssImportRegex, (match) => {
        return `// CSS import handled by preview system: ${match}`;
      });
      
      // 在文件末尾添加 CSS 加载代码，避免影响源代码位置信息
      processedContent = processedContent + '\n' + cssLoaderCode;
    }

    return processedContent;
  }

  private resolvePath(currentDir: string, relativePath: string): string {
    // 简单的路径解析
    if (relativePath.startsWith('./')) {
      return currentDir + relativePath.substring(2);
    }
    
    if (relativePath.startsWith('../')) {
      const parts = relativePath.split('/');
      let dir = currentDir;
      
      for (const part of parts) {
        if (part === '..') {
          dir = dir.substring(0, dir.lastIndexOf('/', dir.length - 2) + 1);
        } else if (part !== '') {
          dir += part + '/';
        }
      }
      
      return dir.substring(0, dir.length - 1); // 移除末尾的 '/'
    }
    
    return relativePath;
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
    // 按顺序应用所有匹配的处理器
    let processedContent = content;
    
    for (const processor of this.processors) {
      if (processor.canProcess(fileName)) {
        try {
          if (processor instanceof TypeScriptProcessor || processor instanceof CSSImportProcessor) {
            processedContent = await processor.process(processedContent, fileName, options);
          } else {
            processedContent = await processor.process(processedContent, fileName);
          }
        } catch (error) {
          console.warn(`Processor ${processor.constructor.name} failed for ${fileName}:`, error);
        }
      }
    }
    
    return processedContent;
  }
}