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

export class PreviewDependencyError extends Error {
  readonly type = 'dependency';
  readonly dependencyName: string;
  readonly fileName: string;
  readonly dependencyUrl?: string;
  readonly lineNumber?: number;
  readonly columnNumber?: number;

  constructor(options: PreviewDependencyErrorOptions) {
    super(options.message ?? `Unable to resolve dependency "${options.dependencyName}" from ${options.fileName}`);
    this.name = 'PreviewDependencyError';
    this.dependencyName = options.dependencyName;
    this.fileName = options.fileName;
    this.dependencyUrl = options.dependencyUrl;
    this.lineNumber = options.lineNumber;
    this.columnNumber = options.columnNumber;
  }
}

export function isPreviewDependencyError(error: unknown): error is PreviewDependencyError {
  return error instanceof PreviewDependencyError || (
    typeof error === 'object'
    && error !== null
    && (error as { type?: unknown }).type === 'dependency'
    && typeof (error as { dependencyName?: unknown }).dependencyName === 'string'
  );
}
