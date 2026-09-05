import { PreviewCompilerLike, PreviewCompileInput, PreviewCompileResult } from '../compilers';
/** Owns one compiler and its results. Only the newest request can be published. */
export declare class CompilationSession {
    private compiler?;
    private compilerKey?;
    private current?;
    private revision;
    private disposed;
    private queue;
    invalidate(): void;
    compile(input: PreviewCompileInput, config?: PreviewCompilerLike): Promise<PreviewCompileResult | null>;
    dispose(): Promise<void>;
    private releaseCurrent;
    private release;
}
//# sourceMappingURL=CompilationSession.d.ts.map