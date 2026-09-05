import type { FileSystem } from '../../compiler/types';
import type { SourceAttributeNameOverrides } from '../sourceAttributes';

export type PreviewCompilerType = 'babel' | 'rspack-browser';

export interface RspackBrowserCompileOptions {
  cdnDomain?: string;
  outputFileName?: string;
  useWorker?: boolean;
  workerFactory?: () => Worker;
  sourceAttributeNames?: SourceAttributeNameOverrides;
}

export interface PreviewCompilerConfig {
  type?: PreviewCompilerType;
  rspack?: RspackBrowserCompileOptions;
}

export interface PreviewCompileInput {
  files: FileSystem;
  entryFile: string;
  depsInfo: Record<string, string>;
  sourceAttributeNames?: SourceAttributeNameOverrides;
}

export interface PreviewCompileResult {
  fileUrls: Map<string, string>;
  sourceMaps?: Map<string, string>;
  entryFile: string;
  transformedFiles: number;
  cleanup?: () => void;
}

export interface PreviewCompiler {
  initialize?(): Promise<void>;
  compile(input: PreviewCompileInput): Promise<PreviewCompileResult>;
  cleanup?(result?: PreviewCompileResult): void | Promise<void>;
}

export type PreviewCompilerLike =
  | PreviewCompilerType
  | PreviewCompilerConfig
  | PreviewCompiler;

// Adapter objects and worker factories are behavior, so their identity is part
// of the configuration even when their serializable options are identical.
const identities = new WeakMap<object, number>();
let nextIdentity = 0;

function identity(value: object): number {
  if (!identities.has(value)) identities.set(value, ++nextIdentity);
  return identities.get(value)!;
}

export function isPreviewCompiler(
  value: PreviewCompilerLike | undefined
): value is PreviewCompiler {
  return typeof value === 'object' && value !== null && 'compile' in value;
}

export function normalizePreviewCompilerConfig(
  compiler?: PreviewCompilerLike
): PreviewCompilerConfig {
  if (!compiler) {
    return { type: 'babel' };
  }

  if (typeof compiler === 'string') {
    return { type: compiler };
  }

  if (isPreviewCompiler(compiler)) {
    return { type: 'babel' };
  }

  return {
    type: compiler.type ?? 'babel',
    rspack: compiler.rspack
  };
}

export function getPreviewCompilerConfigKey(
  compiler?: PreviewCompilerLike
): string {
  if (isPreviewCompiler(compiler)) {
    return `custom:${identity(compiler)}`;
  }

  const config = normalizePreviewCompilerConfig(compiler);
  return JSON.stringify({
    type: config.type,
    rspack: config.rspack
      ? {
          cdnDomain: config.rspack.cdnDomain,
          outputFileName: config.rspack.outputFileName,
          useWorker: config.rspack.useWorker,
          workerFactory: config.rspack.workerFactory
            ? identity(config.rspack.workerFactory)
            : undefined,
          sourceAttributeNames: config.rspack.sourceAttributeNames
        }
      : undefined
  });
}
