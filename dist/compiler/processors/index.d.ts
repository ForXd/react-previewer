import { FileProcessor, TransformOptions } from '../types';
export declare class TypeScriptProcessor implements FileProcessor {
    private astProcessorManager;
    constructor();
    private setupASTProcessors;
    canProcess(fileName: string): boolean;
    process(content: string, fileName: string, options?: TransformOptions): Promise<string>;
}
export declare class FileProcessorManager {
    private processors;
    addProcessor(processor: FileProcessor): void;
    processFile(content: string, fileName: string, options?: TransformOptions): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map