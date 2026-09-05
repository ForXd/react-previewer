import { useLayoutEffect } from 'react';
import type { ReactPreviewerProps } from '../types';
import { usePreviewRuntime } from '../runtime/usePreviewRuntime';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorDisplay } from './ErrorDisplay';
import { joinClassNames } from '../utils/joinClassNames';

/** Presentation and document installation only; runtime state lives in the hook. */
export function PreviewFrame(props: ReactPreviewerProps) {
  const {
    files,
    classNames,
    styles,
    renderLoading,
    renderError,
    iframeTitle = 'React preview'
  } = props;
  const { iframeRef, document, status, activateDocument } =
    usePreviewRuntime(props);

  useLayoutEffect(() => {
    const target = iframeRef.current?.contentDocument;
    if (!target || !document.html) return;
    activateDocument();
    // Keep the host origin for import maps, history and source inspection.
    target.open();
    target.write(document.html);
    target.close();
  }, [document, iframeRef, activateDocument]);

  return (
    <div className="react-previewer__surface">
      {status.isLoading &&
        (renderLoading ? (
          <div
            className={joinClassNames(
              'react-previewer__loading',
              classNames?.loading
            )}
            style={styles?.loading}
          >
            {renderLoading(status)}
          </div>
        ) : (
          <LoadingOverlay
            status={status}
            className={classNames?.loading}
            style={styles?.loading}
          />
        ))}

      {status.error &&
        (renderError ? (
          <div
            className={joinClassNames(
              'react-previewer__error',
              classNames?.error
            )}
            style={styles?.error}
          >
            {renderError(status.error, files)}
          </div>
        ) : (
          <ErrorDisplay
            error={status.error}
            files={files}
            className={classNames?.error}
            style={styles?.error}
          />
        ))}

      <iframe
        key={document.version}
        ref={iframeRef}
        title={iframeTitle}
        className={joinClassNames(
          'react-previewer__iframe',
          status.isLoading && 'react-previewer__iframe--loading',
          classNames?.iframe
        )}
        style={styles?.iframe}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
