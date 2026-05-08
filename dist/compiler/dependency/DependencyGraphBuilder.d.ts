import { DependencyGraph } from './DependencyGraph';
import { DependencyAnalyzer } from '../types';
export declare class DependencyGraphBuilder {
    private analyzer;
    constructor(analyzer?: DependencyAnalyzer);
    build(files: Record<string, string>): Promise<DependencyGraph>;
    private shouldAnalyze;
}
//# sourceMappingURL=DependencyGraphBuilder.d.ts.map