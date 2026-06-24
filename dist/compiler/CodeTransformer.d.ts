import { FileSystem, TransformOptions } from './types';
export declare class CodeTransformer {
    private initialized;
    private fileProcessorManager;
    private dependencyGraphBuilder;
    constructor();
    private setupProcessors;
    initialize(): Promise<void>;
    transformFiles(files: FileSystem, depsInfo: Record<string, string>): Promise<Map<string, string>>;
    transformFileContents(files: FileSystem, depsInfo: Record<string, string>, options?: Pick<TransformOptions, 'importResolution'>): Promise<Map<string, string>>;
    private processFilesInOrder;
    private createBlobURL;
    /**
     * 清理生成的 blob URLs
     */
    cleanup(fileUrls: Map<string, string>): void;
}
//# sourceMappingURL=CodeTransformer.d.ts.map