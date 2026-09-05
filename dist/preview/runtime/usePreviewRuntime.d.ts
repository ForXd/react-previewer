import { PreviewStatus, ReactPreviewerProps } from '../types';
type PreviewDocument = {
    version: number;
    html: string;
};
/** Connects the compilation session and iframe protocol to one status snapshot. */
export declare function usePreviewRuntime(props: ReactPreviewerProps): {
    iframeRef: import('react').RefObject<HTMLIFrameElement>;
    document: PreviewDocument;
    status: PreviewStatus;
    activateDocument: () => void;
};
export {};
//# sourceMappingURL=usePreviewRuntime.d.ts.map