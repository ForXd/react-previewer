import type { ASTProcessor, TransformOptions } from '../types';
import { transform } from '@babel/standalone';
import { createJSXAttribute, hasAttribute, resolveRelativePath, getResolvedFilename } from '../utils';
import { createModuleLogger } from '../../preview/utils/Logger';
import { resolveSourceAttributeNames } from '../../preview/sourceAttributes';
import { resolveDependencyUrl } from '../../preview/DependencyResolver';
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
  process(node: Node, _: string, options: TransformOptions): void {
    if (node.type === 'JSXOpeningElement') {
      addJSXSourceInfoAttributes(node as ExtendedNode, options);
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
    if (isCssImportPath(moduleName)) {
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
    const { filename, files, depsInfo } = options;
    const cssPath = node.source?.value;

    if (!cssPath || !filename) return;

    // 检查是否是远程 CSS 文件
    if (!cssPath.startsWith('./') && !cssPath.startsWith('../') && !cssPath.startsWith('/')) {
      // 远程 CSS 文件，转换为动态加载
      this.transformToRemoteCSSLoader(node, cssPath, resolveRemoteCssUrl(cssPath, depsInfo));
      return;
    }

    // 本地 CSS 文件处理
    const normalizedCssPath = stripResourceQuery(cssPath);
    let resolvedPath = normalizedCssPath;
    if (cssPath.startsWith('./') || cssPath.startsWith('../')) {
      resolvedPath = resolveRelativePath(filename, normalizedCssPath);
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

  private transformToRemoteCSSLoader(node: ExtendedNode, cssPath: string, cssUrl = cssPath): void {
    // 将远程 CSS 导入转换为统一资源加载器调用
    node.type = 'ExpressionStatement';
    node.expression = {
      type: 'AwaitExpression',
      argument: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'window' },
          property: { type: 'Identifier', name: '__reactPreviewLoadStyle' }
        },
        arguments: [
          { type: 'StringLiteral', value: cssUrl },
          { type: 'StringLiteral', value: cssPath }
        ]
      },
    } as unknown as ExtendedNode;

    logger.debug('Transformed remote CSS import:', cssPath, '-> resource loader:', cssUrl);
  }

  private transformToLocalCSSLoader(node: ExtendedNode, cssPath: string, cssContent: string): void {
    // 将本地 CSS 导入转换为统一资源加载器调用
    node.type = 'ExpressionStatement';
    node.expression = {
      type: 'AwaitExpression',
      argument: {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'window' },
          property: { type: 'Identifier', name: '__reactPreviewInjectStyle' }
        },
        arguments: [
          { type: 'StringLiteral', value: cssPath },
          { type: 'StringLiteral', value: cssContent }
        ]
      },
    } as unknown as ExtendedNode;

    logger.debug('Transformed local CSS import:', cssPath, '-> resource loader');
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
              updateJSXElementEndPosition(path.node as ExtendedNode, options.sourceAttributeNames);
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

export function injectJSXSourceInfo(
  code: string,
  options: Pick<TransformOptions, 'filename' | 'files' | 'sourceAttributeNames'>
): string {
  const result = transform(code, {
    ast: true,
    filename: options.filename,
    presets: [
      ['typescript', {
        allExtensions: true,
        isTSX: true
      }]
    ],
    plugins: [
      () => ({
        visitor: {
          JSXOpeningElement: (path: { node: Node }) => {
            addJSXSourceInfoAttributes(path.node as ExtendedNode, options);
          },
          JSXElement: (path: { node: Node }) => {
            updateJSXElementEndPosition(path.node as ExtendedNode, options.sourceAttributeNames);
          }
        }
      })
    ]
  });

  return result.code ?? code;
}

export function injectJSXSourceInfoAndCssImports(
  code: string,
  options: Pick<TransformOptions, 'filename' | 'files' | 'depsInfo' | 'sourceAttributeNames'>
): string {
  const cssImportProcessor = new ImportProcessor();
  const result = transform(code, {
    ast: true,
    filename: options.filename,
    presets: [
      ['typescript', {
        allExtensions: true,
        isTSX: true
      }]
    ],
    plugins: [
      () => ({
        visitor: {
          JSXOpeningElement: (path: { node: Node }) => {
            addJSXSourceInfoAttributes(path.node as ExtendedNode, options);
          },
          ImportDeclaration: (path: { node: Node }) => {
            const node = path.node as ExtendedNode;
            if (node.source?.value && isCssImportPath(node.source.value)) {
              cssImportProcessor.process(node, code, options);
            }
          },
          JSXElement: (path: { node: Node }) => {
            updateJSXElementEndPosition(path.node as ExtendedNode, options.sourceAttributeNames);
          }
        }
      })
    ]
  });

  return result.code ?? code;
}

function resolveRemoteCssUrl(cssPath: string, depsInfo?: Record<string, string>): string {
  if (/^https?:\/\//i.test(cssPath) || cssPath.startsWith('//')) {
    return cssPath;
  }

  return resolveDependencyUrl(cssPath, depsInfo ?? {}, { target: '', external: [] }) ?? cssPath;
}

function isCssImportPath(importPath: string): boolean {
  return stripResourceQuery(importPath).endsWith('.css');
}

function stripResourceQuery(importPath: string): string {
  return importPath.split(/[?#]/, 1)[0] ?? importPath;
}

function addJSXSourceInfoAttributes(
  node: ExtendedNode,
  options: Pick<TransformOptions, 'filename' | 'files' | 'sourceAttributeNames'>
): void {
  const { filename, files } = options;
  const attributes = resolveSourceAttributeNames(options.sourceAttributeNames);

  if (!node.loc) return;

  const line = node.loc.start.line;
  const column = node.loc.start.column;

  if (!node.attributes) {
    node.attributes = [];
  }

  // 添加行号
  if (!hasAttribute(node.attributes, attributes.line)) {
    const lineAttr = createJSXAttribute(attributes.line, line.toString());
    node.attributes.push(lineAttr);
  }

  // 添加列号
  if (!hasAttribute(node.attributes, attributes.column)) {
    const columnAttr = createJSXAttribute(attributes.column, column.toString());
    node.attributes.push(columnAttr);
  }

  if (!hasAttribute(node.attributes, attributes.endLine)) {
    const endLineAttr = createJSXAttribute(attributes.endLine, node.loc.end.line.toString());
    node.attributes.push(endLineAttr);
  }

  if (!hasAttribute(node.attributes, attributes.endColumn)) {
    const endColumnAttr = createJSXAttribute(attributes.endColumn, node.loc.end.column.toString());
    node.attributes.push(endColumnAttr);
  }

  // 添加文件位置
  if (!hasAttribute(node.attributes, attributes.file) && filename) {
    const resolvedFilename = getResolvedFilename(filename, files);
    const fileAttr = createJSXAttribute(attributes.file, resolvedFilename);
    node.attributes.push(fileAttr);
  }
}

function updateJSXElementEndPosition(node: ExtendedNode, sourceAttributeNames?: TransformOptions['sourceAttributeNames']): void {
  const openingElement = node.openingElement;
  const closingElement = node.closingElement;
  const attributes = resolveSourceAttributeNames(sourceAttributeNames);

  if (openingElement && closingElement && openingElement.loc && closingElement.loc) {
    if (!openingElement.attributes) {
      openingElement.attributes = [];
    }

    openingElement.attributes = openingElement.attributes.filter((attr) => {
      const attrName = attr.name?.type === 'JSXIdentifier' ? attr.name.name : '';
      return attrName !== attributes.endLine && attrName !== attributes.endColumn;
    });

    openingElement.attributes.push(
      createJSXAttribute(attributes.endLine, closingElement.loc.end.line.toString()),
      createJSXAttribute(attributes.endColumn, closingElement.loc.end.column.toString())
    );
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
