import { CodeTransformer } from '../../compiler/CodeTransformer';
import type { PreviewCompiler, PreviewCompileInput, PreviewCompileResult } from './types';
import { DEFAULT_DEPENDENCIES } from '../constant';

export class BabelPreviewCompiler implements PreviewCompiler {
  private codeTransformer = new CodeTransformer();

  async initialize(): Promise<void> {
    await this.codeTransformer.initialize();
  }

  async compile(input: PreviewCompileInput): Promise<PreviewCompileResult> {
    const fileUrls = await this.codeTransformer.transformFiles(
      input.files,
      { ...DEFAULT_DEPENDENCIES, ...input.depsInfo },
      { sourceAttributeNames: input.sourceAttributeNames }
    );

    return {
      fileUrls,
      entryFile: input.entryFile,
      transformedFiles: fileUrls.size
    };
  }

  cleanup(result?: PreviewCompileResult): void {
    if (result) {
      this.codeTransformer.cleanup(result.fileUrls);
    }
  }
}
