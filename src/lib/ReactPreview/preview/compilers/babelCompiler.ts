import { CodeTransformer } from '../../compiler/CodeTransformer';
import type { PreviewCompiler, PreviewCompileInput, PreviewCompileResult } from './types';
import { transformDepsToEsmLinks } from '../DependencyResolver';
import { DEFAULT_DEPENDENCIES, TRANSFORM_OPTIONS } from '../constant';

export class BabelPreviewCompiler implements PreviewCompiler {
  private codeTransformer = new CodeTransformer();

  async initialize(): Promise<void> {
    await this.codeTransformer.initialize();
  }

  async compile(input: PreviewCompileInput): Promise<PreviewCompileResult> {
    const advancedResult = transformDepsToEsmLinks(
      { ...DEFAULT_DEPENDENCIES, ...input.depsInfo },
      TRANSFORM_OPTIONS
    );

    const fileUrls = await this.codeTransformer.transformFiles(
      input.files,
      advancedResult.dependencies,
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
