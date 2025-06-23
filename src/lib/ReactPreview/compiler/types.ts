import type { Node } from '@babel/types';

export interface TransformOptions {
  filename?: string;
  files?: Record<string, string>;
  depsInfo?: Record<string, string>;
  fileUrls?: Map<string, string>;
  compiler?: CompilerType;
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
  process(node: Node, source: string, options: TransformOptions): void;
}

export interface DependencyAnalyzer {
  analyze(content: string, fileName: string, files: Record<string, string>): Promise<string[]>;
}

// 新增编译策略相关类型
export type CompilerType = 'babel' | 'swc';

export interface CompilerStrategy {
  name: CompilerType;
  initialize(): Promise<void>;
  transform(code: string, options: TransformOptions): Promise<string>;
  isSupported(fileName: string): boolean;
}

export interface CompilerOptions {
  target?: string;
  jsx?: 'react' | 'react-jsx' | 'preserve';
  typescript?: boolean;
  minify?: boolean;
  sourceMaps?: boolean;
}

// 新增性能测量相关类型
export interface CompilePerformance {
  compiler: CompilerType;
  duration: number; // 编译耗时（毫秒）
  fileSize: number; // 输出文件大小（字节）
  timestamp: number; // 编译时间戳
}

export interface CompileResult {
  code: string;
  performance?: CompilePerformance;
}