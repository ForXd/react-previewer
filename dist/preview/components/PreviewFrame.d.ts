import { ErrorInfo, PreviewErrorRenderer, PreviewLoadingRenderer, PreviewRouteState, PreviewStatus, ReactPreviewerClassNames, ReactPreviewerStyles, SourceInfo } from '../types';
import { PreviewCompilerLike } from '../compilers/types';
import { SourceAttributeNameOverrides } from '../sourceAttributes';
export interface PreviewFrameProps {
    files: Record<string, string>;
    entryFile?: string;
    depsInfo?: Record<string, string>;
    dependencyStyles?: Record<string, string | string[]>;
    previewPath?: string;
    onError?: (error: Error, info: ErrorInfo) => void;
    onElementClick?: (sourceInfo: SourceInfo) => void;
    onRouteChange?: (route: PreviewRouteState) => void;
    isInspecting?: boolean;
    onStatusChange?: (status: PreviewStatus) => void;
    compileDelay?: number;
    enableTailwind?: boolean;
    compiler?: PreviewCompilerLike;
    sourceAttributeNames?: SourceAttributeNameOverrides;
    classNames?: ReactPreviewerClassNames;
    styles?: ReactPreviewerStyles;
    renderLoading?: PreviewLoadingRenderer;
    renderError?: PreviewErrorRenderer;
    iframeTitle?: string;
}
export declare function PreviewFrame({ files, entryFile, depsInfo, dependencyStyles, previewPath, onError, onElementClick, onRouteChange, isInspecting, onStatusChange, compileDelay, enableTailwind, compiler, sourceAttributeNames, classNames, styles, renderLoading, renderError, iframeTitle }: PreviewFrameProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PreviewFrame.d.ts.map