export interface SourceAttributeNames {
  line: string;
  column: string;
  endLine: string;
  endColumn: string;
  file: string;
}

export type SourceAttributeNameOverrides = Partial<SourceAttributeNames>;

export const DEFAULT_SOURCE_ATTRIBUTE_NAMES: SourceAttributeNames = {
  line: 'data-preview-line',
  column: 'data-preview-column',
  endLine: 'data-preview-end-line',
  endColumn: 'data-preview-end-column',
  file: 'data-preview-file'
};

export function resolveSourceAttributeNames(
  overrides?: SourceAttributeNameOverrides
): SourceAttributeNames {
  return {
    ...DEFAULT_SOURCE_ATTRIBUTE_NAMES,
    ...overrides
  };
}

export function createSourceAttributeSelector(
  overrides?: SourceAttributeNameOverrides
): string {
  const attributes = resolveSourceAttributeNames(overrides);
  return [
    attributes.line,
    attributes.column,
    attributes.endLine,
    attributes.endColumn,
    attributes.file
  ].map((attribute) => `[${attribute}]`).join('');
}

export function createSourceAttributeKey(
  overrides?: SourceAttributeNameOverrides
): string {
  return JSON.stringify(resolveSourceAttributeNames(overrides));
}
