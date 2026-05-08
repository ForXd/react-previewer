import { DependencyNode } from '../types';
export declare class DependencyGraph {
    private nodes;
    addFile(fileName: string): void;
    addDependency(from: string, to: string): void;
    /**
     * 拓扑排序，返回处理顺序
     */
    getProcessingOrder(): string[];
    getNode(fileName: string): DependencyNode | undefined;
    getAllFiles(): string[];
}
//# sourceMappingURL=DependencyGraph.d.ts.map