export interface TransformOptions {
  filename?: string;
  files?: Record<string, string>;
  depsInfo?: Record<string, string>;
  fileUrls?: Map<string, string>;
}

export type FileSystem = Record<string, string>;

export interface DependencyNode {
  fileName: string;
  dependencies: Set<string>;
  dependents: Set<string>;
  processed: boolean;
}

export interface FileProcessor {
  canProcess(fileName: string): boolean;
  process(content: string, fileName: string, options?: TransformOptions): Promise<string>;
}

export interface ASTProcessor {
  process(node: any, source: string, options: TransformOptions): void;
}

export interface DependencyAnalyzer {
  analyze(content: string, fileName: string, files: Record<string, string>): Promise<string[]>;
}