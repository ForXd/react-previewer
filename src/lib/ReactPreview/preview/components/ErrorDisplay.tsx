import { useMemo, useState, type CSSProperties } from 'react';
import type { ErrorInfo } from '../types';
import { joinClassNames } from '../utils/joinClassNames';

interface ErrorDisplayProps {
  error: ErrorInfo;
  files?: Record<string, string>;
  className?: string;
  style?: CSSProperties;
}

interface CodeExcerpt {
  lines: string[];
  startLine: number;
  highlightedLine: number;
}

function getCodeExcerpt(error: ErrorInfo, files?: Record<string, string>): CodeExcerpt | null {
  if (!error.fileName || !error.lineNumber || !files?.[error.fileName]) {
    return null;
  }

  const sourceLines = files[error.fileName].split('\n');
  const startIndex = Math.max(0, error.lineNumber - 4);
  const endIndex = Math.min(sourceLines.length, error.lineNumber + 3);

  return {
    lines: sourceLines.slice(startIndex, endIndex),
    startLine: startIndex + 1,
    highlightedLine: error.lineNumber
  };
}

export function ErrorDisplay({ error, files, className, style }: ErrorDisplayProps) {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const excerpt = useMemo(() => getCodeExcerpt(error, files), [error, files]);
  const location = error.fileName
    ? [error.fileName, error.lineNumber, error.columnNumber].filter(Boolean).join(':')
    : null;

  return (
    <div
      className={joinClassNames('react-previewer__error', className)}
      style={style}
      role="alert"
    >
      <section className="react-previewer__error-card">
        <header className="react-previewer__error-header">
          <span className="react-previewer__error-icon" aria-hidden="true">!</span>
          <div>
            <span className="react-previewer__eyebrow">
              {error.type === 'compile' ? 'Compile error' : 'Runtime error'}
            </span>
            <h2>Preview could not render</h2>
          </div>
        </header>

        <div className="react-previewer__error-body">
          <pre className="react-previewer__error-message">{error.message}</pre>
          {location && <span className="react-previewer__error-location">{location}</span>}

          {error.codeFrame ? (
            <pre className="react-previewer__code">{error.codeFrame}</pre>
          ) : excerpt ? (
            <div className="react-previewer__code" aria-label="Source excerpt">
              {excerpt.lines.map((line, index) => {
                const lineNumber = excerpt.startLine + index;
                const highlighted = lineNumber === excerpt.highlightedLine;

                return (
                  <div
                    className={joinClassNames(
                      'react-previewer__code-line',
                      highlighted && 'react-previewer__code-line--highlighted'
                    )}
                    key={lineNumber}
                  >
                    <span>{lineNumber}</span>
                    <code>{line || ' '}</code>
                  </div>
                );
              })}
            </div>
          ) : null}

          {error.stack && (
            <div className="react-previewer__stack">
              <button
                type="button"
                aria-expanded={isStackExpanded}
                onClick={() => setIsStackExpanded((expanded) => !expanded)}
              >
                <span aria-hidden="true">{isStackExpanded ? '−' : '+'}</span>
                Stack trace
              </button>
              {isStackExpanded && <pre className="react-previewer__code">{error.stack}</pre>}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
