import type { CSSProperties } from 'react';
import type { PreviewStatus } from '../types';
import { joinClassNames } from '../utils/joinClassNames';

const phaseText: Record<PreviewStatus['phase'], string> = {
  idle: 'Preparing preview',
  compiling: 'Compiling preview',
  'loading-js': 'Loading dependencies',
  'loading-css': 'Loading styles',
  rendering: 'Rendering component',
  ready: 'Preview ready',
  error: 'Preview failed'
};

interface LoadingOverlayProps {
  status: PreviewStatus;
  className?: string;
  style?: CSSProperties;
}

export function LoadingOverlay({ status, className, style }: LoadingOverlayProps) {
  const showProgress = status.resourceTotal > 0 && status.phase !== 'compiling';

  return (
    <div
      className={joinClassNames('react-previewer__loading', className)}
      style={style}
      role="status"
      aria-live="polite"
    >
      <div className="react-previewer__loading-card">
        <span className="react-previewer__spinner" aria-hidden="true" />
        <strong>{phaseText[status.phase]}</strong>
        <span className="react-previewer__loading-detail">
          {showProgress
            ? `${status.resourceLoaded}/${status.resourceTotal} resources`
            : 'Your code is being prepared'}
        </span>

        {showProgress && status.currentResource && (
          <span className="react-previewer__loading-resource" title={status.currentResource}>
            {status.currentResource}
          </span>
        )}

        {showProgress && (
          <div className="react-previewer__progress" aria-label={`${status.resourceProgress}%`}>
            <span style={{ width: `${status.resourceProgress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
