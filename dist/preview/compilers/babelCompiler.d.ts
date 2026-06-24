import { PreviewCompiler, PreviewCompileInput, PreviewCompileResult } from './types';
export declare class BabelPreviewCompiler implements PreviewCompiler {
    private codeTransformer;
    initialize(): Promise<void>;
    compile(input: PreviewCompileInput): Promise<PreviewCompileResult>;
    cleanup(result?: PreviewCompileResult): void;
}
//# sourceMappingURL=babelCompiler.d.ts.map