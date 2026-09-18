import { useEffect } from 'react';
import type { ReactPreviewerProps } from './types';
import { PreviewFrame } from './components/PreviewFrame';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/Logger';
import { joinClassNames } from './utils/joinClassNames';

export function ReactPreviewer({
  loggerConfig,
  initialPath = '/',
  files,
  renderError,
  className,
  style,
  classNames,
  styles,
  ...previewProps
}: ReactPreviewerProps) {
  useEffect(() => {
    if (loggerConfig) {
      logger.configure(loggerConfig);
    }
  }, [loggerConfig]);

  return (
    <div
      className={joinClassNames('react-previewer', className, classNames?.root)}
      style={{ ...styles?.root, ...style }}
    >
      <ErrorBoundary
        renderFallback={renderError
          ? (error) => (
              <div
                className={joinClassNames('react-previewer__error', classNames?.error)}
                style={styles?.error}
              >
                {renderError({
                  type: 'runtime',
                  message: error.message,
                  stack: error.stack
                }, files)}
              </div>
            )
          : undefined}
      >
        <PreviewFrame
          {...previewProps}
          files={files}
          initialPath={initialPath}
          classNames={classNames}
          styles={styles}
          renderError={renderError}
        />
      </ErrorBoundary>
    </div>
  );
}
