import type { DependencyNode } from '../types';

export class DependencyGraph {
  private nodes = new Map<string, DependencyNode>();

  addFile(fileName: string): void {
    if (!this.nodes.has(fileName)) {
      this.nodes.set(fileName, {
        fileName,
        dependencies: new Set(),
        dependents: new Set(),
        processed: false
      });
    }
  }

  addDependency(from: string, to: string): void {
    this.addFile(from);
    this.addFile(to);
    
    const fromNode = this.nodes.get(from)!;
    const toNode = this.nodes.get(to)!;
    
    fromNode.dependencies.add(to);
    toNode.dependents.add(from);
  }

  /**
   * 拓扑排序，返回处理顺序
   */
  getProcessingOrder(): string[] {
    const result: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (fileName: string): void => {
      if (visited.has(fileName)) return;
      if (visiting.has(fileName)) {
        console.warn(`Circular dependency detected involving: ${fileName}`);
        return;
      }

      visiting.add(fileName);
      const node = this.nodes.get(fileName);
      
      if (node) {
        for (const dep of node.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(fileName);
      visited.add(fileName);
      result.push(fileName);
    };

    // 优先处理 CSS 文件
    const cssFiles = Array.from(this.nodes.keys()).filter(f => f.endsWith('.css'));
    const otherFiles = Array.from(this.nodes.keys()).filter(f => !f.endsWith('.css'));

    [...cssFiles, ...otherFiles].forEach(fileName => visit(fileName));

    return result;
  }

  getNode(fileName: string): DependencyNode | undefined {
    return this.nodes.get(fileName);
  }

  getAllFiles(): string[] {
    return Array.from(this.nodes.keys());
  }
}