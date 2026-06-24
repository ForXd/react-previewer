import { SourceAttributeNameOverrides } from '../sourceAttributes';
export declare class HTMLGenerator {
    private cache;
    generatePreviewHTML(entryUrl: string, depsInfo?: Record<string, string>, dependencyStyles?: Record<string, string | string[]>, initialPath?: string, sourceAttributeNames?: SourceAttributeNameOverrides): string;
    private getBaseStyles;
    private resolveStyleResources;
    private getPreviewScript;
}
//# sourceMappingURL=HTMLGenerator.d.ts.map