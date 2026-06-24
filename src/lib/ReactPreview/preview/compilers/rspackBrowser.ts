import { DEFAULT_DEPENDENCIES, TRANSFORM_OPTIONS } from '../constant';
import { transformDepsToEsmLinks } from '../DependencyResolver';
import type {
  PreviewCompiler,
  PreviewCompileInput,
  PreviewCompileResult,
  RspackBrowserCompileOptions
} from './types';

const DEFAULT_OUTPUT_FILE = 'main.js';

type RspackConfig = Record<string, unknown>;
type RspackExternalCallback = (error?: Error | null, result?: string, type?: string) => void;

interface RspackExternalContext {
  request?: string;
}

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
  dependencyUrl?: Record<string, string> | ((request: { request: string; packageName: string }) => string | undefined);
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

interface RspackAssetInfo {
  name: string;
}

type RspackWorkerResponse =
  | {
      type: 'compiled';
      id: number;
      result: RspackBrowserProjectResult;
    }
  | {
      type: 'error';
      id: number;
      message: string;
      stack?: string;
    };

type PendingWorkerCompile = {
  entryFile: string;
  resolve: (result: PreviewCompileResult) => void;
  reject: (error: Error) => void;
};

export class RspackBrowserPreviewCompiler implements PreviewCompiler {
  private options: RspackBrowserCompileOptions;
  private worker: Worker | null = null;
  private nextRequestId = 0;
  private pendingCompiles = new Map<number, PendingWorkerCompile>();

  constructor(options: RspackBrowserCompileOptions = {}) {
    this.options = options;
  }

  async compile(input: PreviewCompileInput): Promise<PreviewCompileResult> {
    if (this.shouldUseWorker()) {
      return this.compileInWorker(input);
    }

    const result = await compileRspackBrowserProject(input, this.options);
    return createPreviewCompileResult(input.entryFile, result);
  }

  cleanup(result?: PreviewCompileResult): void {
    if (result) {
      revokePreviewCompileResult(result);
      return;
    }

    this.worker?.terminate();
    this.worker = null;
    this.rejectPendingCompiles(new Error('Rspack browser compiler worker was terminated'));
  }

  private shouldUseWorker(): boolean {
    if (this.options.useWorker === false) {
      return false;
    }

    return (
      typeof Worker !== 'undefined' &&
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  private compileInWorker(input: PreviewCompileInput): Promise<PreviewCompileResult> {
    const worker = this.getWorker();
    const id = ++this.nextRequestId;

    return new Promise((resolve, reject) => {
      this.pendingCompiles.set(id, { entryFile: input.entryFile, resolve, reject });
      worker.postMessage({
        type: 'compile',
        id,
        input,
        options: serializeRspackOptions(this.options)
      });
    });
  }

  private getWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }

    this.worker = this.options.workerFactory?.() ?? createDefaultRspackWorker();
    this.worker.addEventListener('message', this.handleWorkerMessage);
    this.worker.addEventListener('error', this.handleWorkerError);
    return this.worker;
  }

  private handleWorkerMessage = (event: MessageEvent<RspackWorkerResponse>) => {
    const message = event.data;
    const pending = this.pendingCompiles.get(message.id);
    if (!pending) return;

    this.pendingCompiles.delete(message.id);

    if (message.type === 'compiled') {
      pending.resolve(createPreviewCompileResult(pending.entryFile, message.result));
      return;
    }

    const error = new Error(message.message);
    if (message.stack) {
      error.stack = message.stack;
    }
    pending.reject(error);
  };

  private handleWorkerError = (event: ErrorEvent) => {
    this.rejectPendingCompiles(event.error instanceof Error ? event.error : new Error(event.message));
  };

  private rejectPendingCompiles(error: Error): void {
    for (const pending of this.pendingCompiles.values()) {
      pending.reject(error);
    }
    this.pendingCompiles.clear();
  }
}

export async function compileRspackBrowserProject(
  input: PreviewCompileInput,
  options: RspackBrowserCompileOptions = {},
  rspackBrowserModule?: RspackBrowserModule
): Promise<RspackBrowserProjectResult> {
  const rspackModule = rspackBrowserModule ?? await loadRspackBrowserModule();
  const outputFileName = options.outputFileName ?? DEFAULT_OUTPUT_FILE;
  const projectFiles = createProjectFiles(input.files);
  const volume = rspackModule.builtinMemFs.volume;
  volume.reset?.();
  volume.fromJSON(projectFiles, '/');

  const config = createRspackBrowserConfig(input, options, rspackModule);
  let compilationStats: RspackStats | undefined;

  await new Promise<void>((resolve, reject) => {
    rspackModule.rspack(config, (error, stats) => {
      compilationStats = stats;
      if (error) {
        reject(error);
        return;
      }

      if (stats?.hasErrors?.()) {
        reject(new Error(formatRspackStatsErrors(stats)));
        return;
      }

      resolve();
    });
  });

  const output = volume.readFileSync(`/dist/${outputFileName}`, 'utf-8');
  const outputText = typeof output === 'string' ? output : new TextDecoder().decode(output);
  const cssRuntime = createCssInjectionRuntime(volume, compilationStats);

  return {
    outputFileName,
    output: `${cssRuntime}${outputText}`,
    transformedFiles: Object.keys(input.files).length
  };
}

export function createRspackBrowserConfig(
  input: PreviewCompileInput,
  options: RspackBrowserCompileOptions = {},
  rspackBrowserModule?: Pick<RspackBrowserModule, 'BrowserHttpImportEsmPlugin'>
): RspackConfig {
  const outputFileName = options.outputFileName ?? DEFAULT_OUTPUT_FILE;
  const allDeps = getRspackDependencies(input.depsInfo);
  const externalRequests = new Set(Object.keys(allDeps));
  const dependencyLinks = transformDepsToEsmLinks(allDeps, TRANSFORM_OPTIONS).dependencies;

  const externalizeKnownDependencies = (
    context: RspackExternalContext,
    callback: RspackExternalCallback
  ) => {
    const request = context.request;
    if (request && externalRequests.has(request)) {
      callback(null, request, 'module');
      return;
    }

    callback();
  };

  return {
    mode: 'development',
    context: '/',
    target: ['web', 'es2020'],
    entry: toProjectPath(input.entryFile),
    devtool: false,
    output: {
      path: '/dist',
      filename: outputFileName,
      chunkFilename: '[name].js',
      module: true,
      library: {
        type: 'module'
      },
      environment: {
        module: true
      }
    },
    experiments: {
      outputModule: true,
      buildHttp: {
        allowedUris: ['https://']
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css']
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      development: false
                    }
                  }
                }
              }
            }
          ]
        },
        {
          test: /\.css$/,
          type: 'css/auto'
        }
      ]
    },
    externalsType: 'module',
    externals: [externalizeKnownDependencies],
    optimization: {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false
    },
    plugins: createRspackBrowserPlugins(
      options.cdnDomain ?? 'https://esm.sh',
      dependencyLinks,
      allDeps,
      rspackBrowserModule
    )
  };
}

function createProjectFiles(
  files: Record<string, string>
): Record<string, string> {
  const projectFiles: Record<string, string> = {
    '/package.json': JSON.stringify({ type: 'module' })
  };

  for (const [fileName, content] of Object.entries(files)) {
    projectFiles[toProjectPath(fileName)] = content;
  }

  return projectFiles;
}

function getRspackDependencies(depsInfo: Record<string, string>): Record<string, string> {
  return {
    ...DEFAULT_DEPENDENCIES,
    'react-dom/client': DEFAULT_DEPENDENCIES['react-dom'],
    'react/jsx-runtime': DEFAULT_DEPENDENCIES.react,
    'react/jsx-dev-runtime': DEFAULT_DEPENDENCIES.react,
    ...depsInfo
  };
}

function createCssInjectionRuntime(volume: RspackBrowserVolume, stats?: RspackStats): string {
  const cssAssets = getRspackAssetNames(stats)
    .filter((assetName) => assetName.endsWith('.css'));

  if (cssAssets.length === 0) {
    return '';
  }

  const injections = cssAssets.map((assetName) => {
    const content = volume.readFileSync(`/dist/${assetName}`, 'utf-8');
    const cssText = typeof content === 'string' ? content : new TextDecoder().decode(content);
    return `await window.__reactPreviewInjectStyle(${JSON.stringify(assetName)}, ${JSON.stringify(cssText)});`;
  });

  return `${injections.join('\n')}\n`;
}

function getRspackAssetNames(stats?: RspackStats): string[] {
  const json = stats?.toJson?.({ assets: true });
  if (!isStatsJsonWithAssets(json)) {
    return [];
  }

  return json.assets
    .map((asset) => asset.name)
    .filter((name): name is string => typeof name === 'string');
}

function createRspackBrowserPlugins(
  domain: string,
  dependencyLinks: Record<string, string>,
  dependencyVersions: Record<string, string>,
  rspackBrowserModule?: Pick<RspackBrowserModule, 'BrowserHttpImportEsmPlugin'>
): unknown[] {
  if (!rspackBrowserModule?.BrowserHttpImportEsmPlugin) {
    return [];
  }

  return [
    new rspackBrowserModule.BrowserHttpImportEsmPlugin({
      domain,
      dependencyVersions,
      dependencyUrl(request) {
        return dependencyLinks[request.request] ?? dependencyLinks[request.packageName];
      }
    })
  ];
}

function createPreviewCompileResult(
  entryFile: string,
  result: RspackBrowserProjectResult
): PreviewCompileResult {
  const blob = new Blob([result.output], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  const fileUrls = new Map<string, string>([
    [entryFile, url],
    [result.outputFileName, url]
  ]);

  return {
    fileUrls,
    entryFile,
    transformedFiles: result.transformedFiles,
    cleanup: () => URL.revokeObjectURL(url)
  };
}

function revokePreviewCompileResult(result: PreviewCompileResult): void {
  result.cleanup?.();
}

function toProjectPath(fileName: string): string {
  return `/src/${fileName.replace(/^\/+/, '')}`;
}

function formatRspackStatsErrors(stats: RspackStats): string {
  const json = stats.toJson?.({ errors: true });
  if (isStatsJsonWithErrors(json)) {
    return json.errors
      .map((error) => error.message || String(error))
      .join('\n');
  }

  return stats.toString?.({ errors: true }) || 'Rspack browser compilation failed';
}

function isStatsJsonWithErrors(value: unknown): value is { errors: Array<{ message?: string }> } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { errors?: unknown }).errors)
  );
}

function isStatsJsonWithAssets(value: unknown): value is { assets: RspackAssetInfo[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { assets?: unknown }).assets)
  );
}

function serializeRspackOptions(options: RspackBrowserCompileOptions): RspackBrowserCompileOptions {
  return {
    cdnDomain: options.cdnDomain,
    outputFileName: options.outputFileName,
    useWorker: false
  };
}

function createDefaultRspackWorker(): Worker {
  return new Worker(new URL(/* @vite-ignore */ './rspack-browser-worker.js', import.meta.url), {
    type: 'module',
    name: 'react-previewer-rspack-browser'
  });
}

async function loadRspackBrowserModule(): Promise<RspackBrowserModule> {
  return await import('@rspack/browser') as RspackBrowserModule;
}
