import type { DependencyAnalyzer } from '../types';
import { resolveRelativePath, getResolvedFilename } from '../utils';

export class TypeScriptDependencyAnalyzer implements DependencyAnalyzer {
  async analyze(content: string, fileName: string, files: Record<string, string>): Promise<string[]> {
    try {
      const initSwc = await import('@swc/wasm-web');
      
      const ast = await initSwc.parse(content, {
        syntax: 'typescript',
        tsx: true,
        decorators: true,
        dynamicImport: true,
      });

      const dependencies: string[] = [];

      this.traverseAST(ast, (node: any) => {
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

  private traverseAST(node: any, callback: (node: any) => void): void {
    if (!node || typeof node !== 'object') return;

    callback(node);

    for (const key in node) {
      if (node.hasOwnProperty(key)) {
        const value = node[key];
        if (Array.isArray(value)) {
          value.forEach(item => this.traverseAST(item, callback));
        } else if (typeof value === 'object' && value !== null) {
          this.traverseAST(value, callback);
        }
      }
    }
  }
}