import { PreviewCompilerLike, PreviewCompileResult } from '../compilers';
export declare class FileProcessor {
    private compiler;
    private compilerKey;
    private currentResult;
    constructor(compiler?: PreviewCompilerLike);
    configure(compiler?: PreviewCompilerLike): Promise<void>;
    initialize(): Promise<void>;
    processFiles(files: Record<string, string>, depsInfo: Record<string, string>, entryFile: string): Promise<PreviewCompileResult>;
    cleanup(): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=FileProcessor.d.ts.map