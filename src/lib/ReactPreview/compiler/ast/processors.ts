import type { ASTProcessor, TransformOptions } from '../types';
import { transform } from '@babel/standalone';
import { createJSXAttribute, hasAttribute, resolveRelativePath, getResolvedFilename } from '../utils';

export class JSXDebugProcessor implements ASTProcessor {
  process(node: any, source: string, options: TransformOptions): void {
    if (node.type === 'JSXOpeningElement') {
      this.processJSXOpeningElement(node, source, options);
    }
  }

  private processJSXOpeningElement(node: any, source: string, options: TransformOptions): void {
    const { filename, files } = options;

    if (!node.loc) return;

    const line = node.loc.start.line;
    const column = node.loc.start.column;

    if (!node.attributes) {
      node.attributes = [];
    }

    // 添加行号
    if (!hasAttribute(node.attributes, 'data-pipo-line')) {
      const lineAttr = createJSXAttribute('data-pipo-line', line.toString());
      node.attributes.push(lineAttr);
    }

    // 添加列号
    if (!hasAttribute(node.attributes, 'data-pipo-column')) {
      const columnAttr = createJSXAttribute('data-pipo-column', column.toString());
      node.attributes.push(columnAttr);
    }

    // 添加文件位置
    if (!hasAttribute(node.attributes, 'data-pipo-file') && filename) {
      const resolvedFilename = getResolvedFilename(filename, files);
      const fileAttr = createJSXAttribute('data-pipo-file', resolvedFilename);
      node.attributes.push(fileAttr);
    }
  }
}

export class ImportProcessor implements ASTProcessor {
  process(node: any, source: string, options: TransformOptions): void {
    if (node.type === 'ImportDeclaration') {
      this.processImportDeclaration(node, source, options);
    }
  }

  private processImportDeclaration(node: any, source: string, options: TransformOptions): void {
    const { filename, files, fileUrls, depsInfo } = options;
    const moduleName = node.source.value;

    if (!moduleName || !filename) return;

    if (moduleName.startsWith('.')) {
      // 处理相对路径导入
      const resolvedPath = resolveRelativePath(filename, moduleName);
      const finalPath = getResolvedFilename(resolvedPath, files);

      console.log("moduleName: =======", moduleName, resolvedPath, finalPath);

      const url = fileUrls?.get(finalPath);
      if (url) {
        node.source.value = url;
        console.log('Resolved local import:', finalPath, '-> URL:', url);
      } else {
        console.warn('URL not found for local file:', finalPath);
      }
    } else {
      // 处理三方依赖导入
      const esmUrl = depsInfo?.[moduleName] || moduleName;
      node.source.value = esmUrl;
      console.log('Resolved external import in ast:', moduleName, '-> ESM URL:', esmUrl, depsInfo);
    }
  }
}

// 工具函数：自动注入 import React
function ensureReactImport(code: string): string {
  // 检查是否已 import React
  if (/import\s+React(\s|,|\{|$)/.test(code) || /from\s+['"]react['"]/.test(code)) {
    return code;
  }
  // 强制注入
  return `import React from 'react';\n${code}`;
}

export class ASTProcessorManager {
  private processors: ASTProcessor[] = [];

  addProcessor(processor: ASTProcessor): void {
    this.processors.push(processor);
  }

  processNode(node: any, source: string, options: TransformOptions): void {
    this.processors.forEach(processor => {
      processor.process(node, source, options);
    });
  }

  traverseAndProcess(code: string, source: string, options: TransformOptions): string {
    // 自动注入 import React
    const codeWithReact = ensureReactImport(code);

    console.log("codeWithReact: =======", codeWithReact);
    // 使用Babel解析代码并遍历AST
    const result = transform(codeWithReact, {
      ast: true,
      presets: ['react', 'typescript'],
      filename: options.filename, // 添加filename参数
      plugins: [
        // 自定义插件，用于处理AST
        () => ({
          visitor: {
            JSXOpeningElement: (path: any) => {
              const node = path.node;
              this.processNode(node, source, options);
            },
            ImportDeclaration: (path: any) => {
              const node = path.node;
              this.processNode(node, source, options);
            },
            JSXElement: (path: any) => {
              const node = path.node;
              const openingElement = node.openingElement;
              const closingElement = node.closingElement;
              
              if (openingElement && closingElement && openingElement.loc && closingElement.loc) {
                // 添加结束行号和列号
                if (!hasAttribute(openingElement.attributes, 'data-pipo-end-line')) {
                  const endLineAttr = createJSXAttribute('data-pipo-end-line', closingElement.loc.end.line.toString());
                  openingElement.attributes.push(endLineAttr);
                }

                if (!hasAttribute(openingElement.attributes, 'data-pipo-end-column')) {
                  const endColumnAttr = createJSXAttribute('data-pipo-end-column', closingElement.loc.end.column.toString());
                  openingElement.attributes.push(endColumnAttr);
                }
              }
            }
          }
        })
      ]
    });

    return result.code ?? '';
  }
}