import { DependencyGraph } from './DependencyGraph';
import type { DependencyAnalyzer } from '../types';
import { TypeScriptDependencyAnalyzer } from './DependencyAnalyzer';

export class DependencyGraphBuilder {
  private analyzer: DependencyAnalyzer;

  constructor(analyzer?: DependencyAnalyzer) {
    this.analyzer = analyzer || new TypeScriptDependencyAnalyzer();
  }

  async build(files: Record<string, string>): Promise<DependencyGraph> {
    const graph = new DependencyGraph();

    // 添加所有文件到图中
    for (const fileName of Object.keys(files)) {
      graph.addFile(fileName);
    }

    // 分析每个文件的依赖关系
    for (const [fileName, content] of Object.entries(files)) {
      if (this.shouldAnalyze(fileName)) {
        const dependencies = await this.analyzer.analyze(content, fileName, files);
        for (const dep of dependencies) {
          graph.addDependency(fileName, dep);
        }
      }
    }

    return graph;
  }

  private shouldAnalyze(fileName: string): boolean {
    return fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.jsx');
  }
}