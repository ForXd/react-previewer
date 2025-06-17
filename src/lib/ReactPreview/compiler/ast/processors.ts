import type { JSXOpeningElement, ImportDeclaration } from '@swc/types';
import type { ASTProcessor, TransformOptions } from '../types';
import { createJSXAttribute, hasAttribute, calculateColumnNumber, calculateLineNumber, resolveRelativePath, getResolvedFilename } from '../utils';

export class JSXDebugProcessor implements ASTProcessor {
  process(node: any, source: string, options: TransformOptions): void {
    if (node.type === 'JSXOpeningElement') {
      this.processJSXOpeningElement(node as JSXOpeningElement, source, options);
    }
  }

  private processJSXOpeningElement(node: JSXOpeningElement, source: string, options: TransformOptions): void {
    // const { filename, files } = options;

    // if (!node.span) return;

    // const line = calculateLineNumber(source, node.span.start);

    // if (!node.attributes) {
    //   node.attributes = [];
    // }

    // if (!hasAttribute(node.attributes, 'data-line')) {
    //   const lineAttr = createJSXAttribute('data-line', line.toString());
    //   node.attributes.push(lineAttr);
    // }

    // if (!hasAttribute(node.attributes, 'data-file') && filename) {
    //   const resolvedFilename = getResolvedFilename(filename, files);
    //   const fileAttr = createJSXAttribute('data-file', resolvedFilename);
    //   node.attributes.push(fileAttr);
    // }
  }
}

export class ImportProcessor implements ASTProcessor {
  process(node: any, source: string, options: TransformOptions): void {
    if (node.type === 'ImportDeclaration') {
      this.processImportDeclaration(node as ImportDeclaration, source, options);
    }
  }

  private processImportDeclaration(node: ImportDeclaration, source: string, options: TransformOptions): void {
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
        node.source.raw = `'${url}'`;
        console.log('Resolved local import:', finalPath, '-> URL:', url);
      } else {
        console.warn('URL not found for local file:', finalPath);
      }
    } else {
      // 处理三方依赖导入
      const esmUrl = depsInfo?.[moduleName] || moduleName;
      node.source.raw = `'${esmUrl}'`;
      console.log('Resolved external import in ast:', moduleName, '-> ESM URL:', esmUrl, depsInfo);
    }
  }
}

export class ASTProcessorManager {
  private processors: ASTProcessor[] = [];
  private nodeParentMap = new WeakMap<any, any>();

  addProcessor(processor: ASTProcessor): void {
    this.processors.push(processor);
  }

  processNode(node: any, source: string, options: TransformOptions): void {
    this.processors.forEach(processor => {
      processor.process(node, source, options);
    });
  }

  traverseAndProcess(node: any, source: string, options: TransformOptions, parent?: any): void {
    if (!node || typeof node !== 'object') return;

    // 建立父子关系映射
    if (parent) {
      this.nodeParentMap.set(node, parent);
    }

    // 特殊处理JSX元素，确保能正确获取结束位置
    if (node.type === 'JSXElement') {
      this.processJSXElement(node, source, options);
    } else {
      this.processNode(node, source, options);
    }

    // 递归遍历子节点
    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];
        if (Array.isArray(value)) {
          value.forEach((item) => this.traverseAndProcess(item, source, options, node));
        } else if (typeof value === 'object' && value !== null) {
          this.traverseAndProcess(value, source, options, node);
        }
      }
    }
  }

  private processJSXElement(jsxElement: any, source: string, options: TransformOptions): void {
    // 处理JSX元素的开始标签
    if (jsxElement.opening) {
      this.processJSXOpeningElementWithClosing(
        jsxElement.opening,
        jsxElement.closing,
        source,
        options
      );
    }
  }

  private processJSXOpeningElementWithClosing(
    openingElement: any,
    closingElement: any,
    source: string,
    options: TransformOptions
  ): void {
    const { filename, files } = options;

    if (!openingElement.span) return;

    // 计算开始行号和列号
    const startLine = calculateLineNumber(source, openingElement.span.start);
    const startColumn = calculateColumnNumber(source, openingElement.span.start);

    // 确保attributes数组存在
    if (!openingElement.attributes) {
      openingElement.attributes = [];
    }

    // 添加开始行号
    if (!hasAttribute(openingElement.attributes, 'data-pipo-line')) {
      const lineAttr = createJSXAttribute('data-pipo-line', startLine.toString());
      openingElement.attributes.push(lineAttr);
    }

    // 添加开始列号
    if (!hasAttribute(openingElement.attributes, 'data-pipo-column')) {
      const columnAttr = createJSXAttribute('data-pipo-column', startColumn.toString());
      openingElement.attributes.push(columnAttr);
    }

    // 添加结束行号（如果有闭合标签）
    if (closingElement?.span) {
      const endLine = calculateLineNumber(source, closingElement.span.end);
      const endColumn = calculateColumnNumber(source, closingElement.span.end);

      if (!hasAttribute(openingElement.attributes, 'data-pipo-end-line')) {
        const endLineAttr = createJSXAttribute('data-pipo-end-line', endLine.toString());
        openingElement.attributes.push(endLineAttr);
      }

      if (!hasAttribute(openingElement.attributes, 'data-pipo-end-column')) {
        const endColumnAttr = createJSXAttribute('data-pipo-end-column', endColumn.toString());
        openingElement.attributes.push(endColumnAttr);
      }
    }

    // 添加文件位置
    if (!hasAttribute(openingElement.attributes, 'data-pipo-file') && filename) {
      const resolvedFilename = getResolvedFilename(filename, files);
      const fileAttr = createJSXAttribute('data-pipo-file', resolvedFilename);
      openingElement.attributes.push(fileAttr);
    }
  }
}