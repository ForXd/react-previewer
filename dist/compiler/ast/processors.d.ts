import { ASTProcessor, TransformOptions } from '../types';
import { Node } from '@babel/types';
export declare class JSXDebugProcessor implements ASTProcessor {
    process(node: Node, source: string, options: TransformOptions): void;
    private processJSXOpeningElement;
}
export declare class ImportProcessor implements ASTProcessor {
    process(node: Node, source: string, options: TransformOptions): void;
    private processImportDeclaration;
    private processCSSImport;
    private transformToRemoteCSSLoader;
    private transformToLocalCSSLoader;
}
export declare class ASTProcessorManager {
    private processors;
    addProcessor(processor: ASTProcessor): void;
    processNode(node: Node, source: string, options: TransformOptions): void;
    traverseAndProcess(code: string, source: string, options: TransformOptions): string;
}
//# sourceMappingURL=processors.d.ts.map