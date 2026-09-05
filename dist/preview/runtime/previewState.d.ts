import { PreviewRouteState, PreviewStatus } from '../types';
export declare const createInitialStatus: () => PreviewStatus;
export declare function normalizePreviewPath(path?: string): string;
export declare function toRouteState(data: Record<string, unknown>): PreviewRouteState;
export declare function resourceStatus(data: Record<string, unknown>): Pick<PreviewStatus, 'resourceTotal' | 'resourceLoaded' | 'resourceProgress' | 'currentResource'>;
//# sourceMappingURL=previewState.d.ts.map