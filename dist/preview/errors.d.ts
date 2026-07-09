export interface DependencyErrorPayload {
    name: string;
    url: string;
    error: string;
}
interface PreviewDependencyErrorOptions {
    dependencyName: string;
    fileName: string;
    dependencyUrl?: string;
    lineNumber?: number;
    columnNumber?: number;
    message?: string;
}
export declare class PreviewDependencyError extends Error {
    readonly type = "dependency";
    readonly dependencyName: string;
    readonly fileName: string;
    readonly dependencyUrl?: string;
    readonly lineNumber?: number;
    readonly columnNumber?: number;
    constructor(options: PreviewDependencyErrorOptions);
}
export declare function isPreviewDependencyError(error: unknown): error is PreviewDependencyError;
export {};
//# sourceMappingURL=errors.d.ts.map