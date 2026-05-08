import { DependencyAnalyzer } from '../types';
export declare class TypeScriptDependencyAnalyzer implements DependencyAnalyzer {
    analyze(content: string, fileName: string, files: Record<string, string>): Promise<string[]>;
    private traverseAST;
}
//# sourceMappingURL=DependencyAnalyzer.d.ts.map