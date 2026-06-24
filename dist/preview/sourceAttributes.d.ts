export interface SourceAttributeNames {
    line: string;
    column: string;
    endLine: string;
    endColumn: string;
    file: string;
}
export type SourceAttributeNameOverrides = Partial<SourceAttributeNames>;
export declare const DEFAULT_SOURCE_ATTRIBUTE_NAMES: SourceAttributeNames;
export declare function resolveSourceAttributeNames(overrides?: SourceAttributeNameOverrides): SourceAttributeNames;
export declare function createSourceAttributeSelector(overrides?: SourceAttributeNameOverrides): string;
export declare function createSourceAttributeKey(overrides?: SourceAttributeNameOverrides): string;
//# sourceMappingURL=sourceAttributes.d.ts.map