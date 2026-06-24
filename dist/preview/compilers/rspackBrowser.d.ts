import { PreviewCompiler, PreviewCompileInput, PreviewCompileResult, RspackBrowserCompileOptions } from './types';
type RspackConfig = Record<string, unknown>;
interface RspackStats {
    hasErrors?: () => boolean;
    toJson?: (options?: Record<string, unknown>) => unknown;
    toString?: (options?: Record<string, unknown>) => string;
}
interface RspackBrowserVolume {
    reset?: () => void;
    fromJSON: (json: Record<string, string>, cwd?: string) => void;
    readFileSync: (path: string, encoding: string) => string | Uint8Array;
}
interface BrowserHttpImportPluginOptions {
    domain: string;
    dependencyUrl?: Record<string, string> | ((request: {
        request: string;
        packageName: string;
    }) => string | undefined);
    dependencyVersions?: Record<string, string>;
}
export interface RspackBrowserModule {
    rspack: (config: RspackConfig, callback: (error: Error | null, stats?: RspackStats) => void) => unknown;
    builtinMemFs: {
        volume: RspackBrowserVolume;
    };
    BrowserHttpImportEsmPlugin?: new (options: BrowserHttpImportPluginOptions) => unknown;
}
export interface RspackBrowserProjectResult {
    outputFileName: string;
    output: string;
    transformedFiles: number;
}
export declare class RspackBrowserPreviewCompiler implements PreviewCompiler {
    private options;
    private worker;
    private nextRequestId;
    private pendingCompiles;
    constructor(options?: RspackBrowserCompileOptions);
    compile(input: PreviewCompileInput): Promise<PreviewCompileResult>;
    cleanup(result?: PreviewCompileResult): void;
    private shouldUseWorker;
    private compileInWorker;
    private getWorker;
    private handleWorkerMessage;
    private handleWorkerError;
    private rejectPendingCompiles;
}
export declare function compileRspackBrowserProject(input: PreviewCompileInput, options?: RspackBrowserCompileOptions, rspackBrowserModule?: RspackBrowserModule): Promise<RspackBrowserProjectResult>;
export declare function createRspackBrowserConfig(input: PreviewCompileInput, options?: RspackBrowserCompileOptions, rspackBrowserModule?: Pick<RspackBrowserModule, 'BrowserHttpImportEsmPlugin'>): RspackConfig;
export {};
//# sourceMappingURL=rspackBrowser.d.ts.map