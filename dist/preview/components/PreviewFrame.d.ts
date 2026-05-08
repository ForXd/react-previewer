import { default as React } from 'react';
import { PreviewStatus, SourceInfo } from '../types';
export interface PreviewFrameProps {
    files: Record<string, string>;
    entryFile: string;
    depsInfo?: Record<string, string>;
    dependencyStyles?: Record<string, string | string[]>;
    onError?: (error: Error) => void;
    onElementClick?: (sourceInfo: SourceInfo) => void;
    isInspecting?: boolean;
    onStatusChange?: (status: PreviewStatus) => void;
    compileDelay?: number;
}
export declare const PreviewFrame: React.FC<PreviewFrameProps>;
//# sourceMappingURL=PreviewFrame.d.ts.map