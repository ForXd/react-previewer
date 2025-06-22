import type { DependencyAnalyzer } from '../types';
import { resolveRelativePath, getResolvedFilename } from '../utils';
import type { Node, File } from '@babel/types';
// import {parser} from '@babel/standalone';

export class TypeScriptDependencyAnalyzer implements DependencyAnalyzer {
  async analyze(content: string, fileName: string, files: Record<string, string>): Promise<string[]> {
    try {
      const ast = (await import('@babel/parser')).parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      }) as File;

      const dependencies: string[] = [];

      this.traverseAST(ast, (node: Node) => {
        if (node.type === 'ImportDeclaration') {
          const moduleName = node.source?.value;
          if (moduleName && moduleName.startsWith('.')) {
            const resolvedPath = resolveRelativePath(fileName, moduleName);
            const finalPath = getResolvedFilename(resolvedPath, files);
            if (files[finalPath]) {
              dependencies.push(finalPath);
            }
          }
        }
      });

      return dependencies;
    } catch (error) {
      console.warn(`Failed to analyze dependencies for ${fileName}:`, error);
      return [];
    }
  }

  private traverseAST(node: Node, callback: (node: Node) => void): void {
    if (!node || typeof node !== 'object') return;

    callback(node);

    for (const key in node) {
      if (Object.prototype.hasOwnProperty.call(node, key)) {
        const value = (node as unknown as Record<string, unknown>)[key];
        if (Array.isArray(value)) {
          value.forEach(item => this.traverseAST(item as Node, callback));
        } else if (typeof value === 'object' && value !== null) {
          this.traverseAST(value as Node, callback);
        }
      }
    }
  }
}