import type { ASTProcessor, TransformOptions } from '../types';
import { transform } from '@babel/standalone';
import { createJSXAttribute, hasAttribute, resolveRelativePath, getResolvedFilename } from '../utils';
import { createModuleLogger } from '../../preview/utils/Logger';
import type { Node } from '@babel/types';

const logger = createModuleLogger('ASTProcessors');

// 定义扩展的节点类型
type ExtendedNode = Node & {
  attributes?: Array<{
    type: string;
    name?: { type: string; name: string };
    value?: { type: string; value: string };
  }>;
  source?: { value: string };
  openingElement?: ExtendedNode;
  closingElement?: ExtendedNode;
  expression?: ExtendedNode;
  type?: string;
  loc?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
};

export class JSXDebugProcessor implements ASTProcessor {
  process(node: Node, source: string, options: TransformOptions): void {
    if (node.type === 'JSXOpeningElement') {
      this.processJSXOpeningElement(node as ExtendedNode, source, options);
    }
  }

  private processJSXOpeningElement(node: ExtendedNode, _: string, options: TransformOptions): void {
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
  process(node: Node, source: string, options: TransformOptions): void {
    if (node.type === 'ImportDeclaration') {
      this.processImportDeclaration(node as ExtendedNode, source, options);
    }
  }

  private processImportDeclaration(node: ExtendedNode, source: string, options: TransformOptions): void {
    const { filename, files, fileUrls, depsInfo } = options;
    const moduleName = node.source?.value;

    if (!moduleName || !filename) return;

    // 检查是否是 CSS 导入
    if (moduleName.endsWith('.css')) {
      this.processCSSImport(node, source, options);
      return;
    }

    if (moduleName.startsWith('.')) {
      // 处理相对路径导入
      const resolvedPath = resolveRelativePath(filename, moduleName);
      const finalPath = getResolvedFilename(resolvedPath, files);

      logger.debug("moduleName: =======", moduleName, resolvedPath, finalPath);

      const url = fileUrls?.get(finalPath);
      if (url && node.source) {
        node.source.value = url;
        logger.debug('Resolved local import:', finalPath, '-> URL:', url);
      } else {
        logger.warn('URL not found for local file:', finalPath);
      }
    } else {
      // 处理三方依赖导入
      const esmUrl = depsInfo?.[moduleName] || moduleName;
      if (node.source) {
        node.source.value = esmUrl;
      }
      logger.debug('Resolved external import in ast:', moduleName, '-> ESM URL:', esmUrl, depsInfo);
    }
  }

  private processCSSImport(node: ExtendedNode, _: string, options: TransformOptions): void {
    const { filename, files } = options;
    const cssPath = node.source?.value;

    if (!cssPath || !filename) return;

    // 检查是否是远程 CSS 文件
    if (!cssPath.startsWith('./') && !cssPath.startsWith('../') && !cssPath.startsWith('/')) {
      // 远程 CSS 文件，转换为动态加载
      this.transformToRemoteCSSLoader(node, cssPath);
      return;
    }

    // 本地 CSS 文件处理
    let resolvedPath = cssPath;
    if (cssPath.startsWith('./') || cssPath.startsWith('../')) {
      resolvedPath = resolveRelativePath(filename, cssPath);
    }

    // 尝试不同的扩展名
    const possiblePaths = [
      resolvedPath,
      `${resolvedPath}.css`,
      resolvedPath.replace(/\.css$/, '') + '.css'
    ];

    let cssContent = '';

    for (const path of possiblePaths) {
      if (files?.[path]) {
        cssContent = files[path];
        logger.debug(`Found CSS file: ${cssPath} -> ${path}`);
        break;
      }
    }

    if (!cssContent) {
      logger.warn(`CSS file not found: ${cssPath}`);
      // 将 CSS 导入替换为空导入，避免运行时错误
      if (node.source) {
        node.source.value = '""';
      }
      return;
    }

    // 将本地 CSS 导入转换为动态样式注入
    this.transformToLocalCSSLoader(node, cssPath, cssContent);
  }

  private transformToRemoteCSSLoader(node: ExtendedNode, cssPath: string): void {
    // 将远程 CSS 导入转换为动态加载
    node.type = 'ExpressionStatement';
    node.expression = {
      type: 'CallExpression',
      callee: {
        type: 'FunctionExpression',
        params: [],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'link' },
                  init: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: { type: 'Identifier', name: 'document' },
                      property: { type: 'Identifier', name: 'createElement' }
                    },
                    arguments: [{ type: 'StringLiteral', value: 'link' }]
                  }
                }
              ]
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'link' },
                  property: { type: 'Identifier', name: 'rel' }
                },
                right: { type: 'StringLiteral', value: 'stylesheet' }
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'link' },
                  property: { type: 'Identifier', name: 'href' }
                },
                right: { type: 'StringLiteral', value: cssPath }
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'document' },
                    property: { type: 'Identifier', name: 'head' }
                  },
                  property: { type: 'Identifier', name: 'appendChild' }
                },
                arguments: [{ type: 'Identifier', name: 'link' }]
              }
            }
          ]
        }
      },
      arguments: []
    } as unknown as ExtendedNode;

    logger.debug('Transformed remote CSS import:', cssPath, '-> dynamic link loading');
  }

  private transformToLocalCSSLoader(node: ExtendedNode, cssPath: string, cssContent: string): void {
    // 将本地 CSS 导入转换为动态样式注入
    node.type = 'ExpressionStatement';
    node.expression = {
      type: 'CallExpression',
      callee: {
        type: 'FunctionExpression',
        params: [],
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name: 'style' },
                  init: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: { type: 'Identifier', name: 'document' },
                      property: { type: 'Identifier', name: 'createElement' }
                    },
                    arguments: [{ type: 'StringLiteral', value: 'style' }]
                  }
                }
              ]
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'style' },
                  property: { type: 'Identifier', name: 'setAttribute' }
                },
                arguments: [
                  { type: 'StringLiteral', value: 'data-path' },
                  { type: 'StringLiteral', value: cssPath }
                ]
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'style' },
                  property: { type: 'Identifier', name: 'innerHTML' }
                },
                right: { type: 'StringLiteral', value: cssContent }
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'MemberExpression',
                    object: { type: 'Identifier', name: 'document' },
                    property: { type: 'Identifier', name: 'head' }
                  },
                  property: { type: 'Identifier', name: 'appendChild' }
                },
                arguments: [{ type: 'Identifier', name: 'style' }]
              }
            }
          ]
        }
      },
      arguments: []
    } as unknown as ExtendedNode;

    logger.debug('Transformed local CSS import:', cssPath, '-> dynamic style injection');
  }
}

export class ASTProcessorManager {
  private processors: ASTProcessor[] = [];

  addProcessor(processor: ASTProcessor): void {
    this.processors.push(processor);
  }

  processNode(node: Node, source: string, options: TransformOptions): void {
    this.processors.forEach(processor => {
      processor.process(node, source, options);
    });
  }

  traverseAndProcess(code: string, source: string, options: TransformOptions): string {
    // 先使用Babel解析代码并遍历AST，进行位置信息注入
    const result = transform(code, {
      ast: true,
      presets: ['react', 'typescript'],
      filename: options.filename,
      plugins: [
        // 自定义插件，用于处理AST
        () => ({
          visitor: {
            JSXOpeningElement: (path: { node: Node }) => {
              const node = path.node;
              this.processNode(node, source, options);
            },
            ImportDeclaration: (path: { node: Node }) => {
              const node = path.node;
              this.processNode(node, source, options);
            },
            JSXElement: (path: { node: Node }) => {
              const node = path.node as ExtendedNode;
              const openingElement = node.openingElement;
              const closingElement = node.closingElement;
              
              if (openingElement && closingElement && openingElement.loc && closingElement.loc) {
                // 添加结束行号和列号
                if (!hasAttribute(openingElement.attributes || [], 'data-pipo-end-line')) {
                  const endLineAttr = createJSXAttribute('data-pipo-end-line', closingElement.loc.end.line.toString());
                  if (!openingElement.attributes) {
                    openingElement.attributes = [];
                  }
                  openingElement.attributes.push(endLineAttr);
                }

                if (!hasAttribute(openingElement.attributes || [], 'data-pipo-end-column')) {
                  const endColumnAttr = createJSXAttribute('data-pipo-end-column', closingElement.loc.end.column.toString());
                  if (!openingElement.attributes) {
                    openingElement.attributes = [];
                  }
                  openingElement.attributes.push(endColumnAttr);
                }
              }
            }
          }
        })
      ]
    });

    // 在位置信息注入后，再注入 React 导入
    const processedCode = result.code ?? '';
    return ensureReactImport(processedCode);
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