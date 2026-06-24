import {
  compileRspackBrowserProject,
  type RspackBrowserProjectResult
} from './rspackBrowser';
import type { PreviewCompileInput, RspackBrowserCompileOptions } from './types';

type CompileRequest = {
  type: 'compile';
  id: number;
  input: PreviewCompileInput;
  options: RspackBrowserCompileOptions;
};

type CompileResponse =
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

self.addEventListener('message', (event: MessageEvent<CompileRequest>) => {
  if (event.data.type !== 'compile') return;

  void compile(event.data);
});

async function compile(request: CompileRequest): Promise<void> {
  try {
    const result = await compileRspackBrowserProject(request.input, {
      ...request.options,
      useWorker: false
    });
    post({
      type: 'compiled',
      id: request.id,
      result
    });
  } catch (error) {
    post({
      type: 'error',
      id: request.id,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

function post(message: CompileResponse): void {
  self.postMessage(message);
}
