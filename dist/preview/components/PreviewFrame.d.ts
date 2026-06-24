import { default as React } from 'react';
import { PreviewRouteState, PreviewStatus, SourceInfo } from '../types';
import { PreviewCompilerLike } from '../compilers/types';
export interface PreviewFrameProps {
    files: Record<string, string>;
    entryFile: string;
    depsInfo?: Record<string, string>;
    dependencyStyles?: Record<string, string | string[]>;
    previewPath?: string;
    onError?: (error: Error) => void;
    onElementClick?: (sourceInfo: SourceInfo) => void;
    onRouteChange?: (route: PreviewRouteState) => void;
    isInspecting?: boolean;
    onStatusChange?: (status: PreviewStatus) => void;
    compileDelay?: number;
    compiler?: PreviewCompilerLike;
}
export declare const PreviewFrame: React.FC<PreviewFrameProps>;
//# sourceMappingURL=PreviewFrame.d.ts.map