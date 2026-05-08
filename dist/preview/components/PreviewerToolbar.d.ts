import { default as React } from 'react';
import { PreviewStatus, PreviewViewport } from '../types';
interface PreviewerToolbarProps {
    isLoading: boolean;
    isInspecting: boolean;
    status: PreviewStatus;
    viewport: PreviewViewport;
    viewportPresets: PreviewViewport[];
    zoom: number;
    onRecompile: () => void;
    onToggleInspect: () => void;
    onViewportChange: (viewport: PreviewViewport) => void;
    onZoomChange: (zoom: number) => void;
}
export declare const PreviewerToolbar: React.FC<PreviewerToolbarProps>;
export {};
//# sourceMappingURL=PreviewerToolbar.d.ts.map