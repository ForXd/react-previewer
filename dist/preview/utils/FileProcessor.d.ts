export declare class FileProcessor {
    private codeTransformer;
    private blobUrls;
    constructor();
    initialize(): Promise<void>;
    processFiles(files: Record<string, string>, depsInfo: Record<string, string>): Promise<Map<string, string>>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=FileProcessor.d.ts.map