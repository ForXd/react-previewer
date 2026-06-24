import { FileSystem } from '../../compiler/types';
export type PreviewCompilerType = 'babel' | 'rspack-browser';
export interface RspackBrowserCompileOptions {
    cdnDomain?: string;
    outputFileName?: string;
    useWorker?: boolean;
    workerFactory?: () => Worker;
}
export interface PreviewCompilerConfig {
    type?: PreviewCompilerType;
    rspack?: RspackBrowserCompileOptions;
}
export interface PreviewCompileInput {
    files: FileSystem;
    entryFile: string;
    depsInfo: Record<string, string>;
}
export interface PreviewCompileResult {
    fileUrls: Map<string, string>;
    entryFile: string;
    transformedFiles: number;
    cleanup?: () => void;
}
export interface PreviewCompiler {
    initialize?(): Promise<void>;
    compile(input: PreviewCompileInput): Promise<PreviewCompileResult>;
    cleanup?(result?: PreviewCompileResult): void | Promise<void>;
}
export type PreviewCompilerLike = PreviewCompilerType | PreviewCompilerConfig | PreviewCompiler;
export declare function isPreviewCompiler(value: PreviewCompilerLike | undefined): value is PreviewCompiler;
export declare function normalizePreviewCompilerConfig(compiler?: PreviewCompilerLike): PreviewCompilerConfig;
export declare function getPreviewCompilerConfigKey(compiler?: PreviewCompilerLike): string;
//# sourceMappingURL=types.d.ts.map