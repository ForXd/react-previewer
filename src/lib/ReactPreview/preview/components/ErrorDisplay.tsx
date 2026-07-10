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

const errorCopy: Record<ErrorInfo['type'], { label: string; title: string; description: string }> = {
  compile: {
    label: 'Compile error',
    title: 'Source could not compile',
    description: 'The compiler stopped before the preview could run.'
  },
  dependency: {
    label: 'Dependency error',
    title: 'Dependency could not load',
    description: 'A referenced dependency could not be loaded.'
  },
  runtime: {
    label: 'Runtime error',
    title: 'Preview crashed while running',
    description: 'The app threw an error after compilation completed.'
  }
};

function getCodeExcerpt(error: ErrorInfo, files?: Record<string, string>): CodeExcerpt | null {
  if (!error.fileName || error.lineNumber === undefined || !files?.[error.fileName]) {
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
  const copy = errorCopy[error.type];
  const locationParts: Array<string | number> = [];
  if (error.fileName) locationParts.push(error.fileName);
  if (error.lineNumber !== undefined) locationParts.push(error.lineNumber);
  if (error.columnNumber !== undefined) locationParts.push(error.columnNumber);
  const location = locationParts.length > 0 ? locationParts.join(':') : null;

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
              {copy.label}
            </span>
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
        </header>

        <div className="react-previewer__error-body">
          <pre className="react-previewer__error-message">{error.message}</pre>
          {location && <span className="react-previewer__error-location">{location}</span>}

          {error.type === 'dependency' && (error.dependencyName || error.dependencyUrl) && (
            <dl className="react-previewer__dependency-details">
              {error.dependencyName && <div><dt>Package</dt><dd>{error.dependencyName}</dd></div>}
              {error.dependencyUrl && <div><dt>Request</dt><dd>{error.dependencyUrl}</dd></div>}
            </dl>
          )}

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
                    {highlighted && error.columnNumber !== undefined && (
                      <span
                        className="react-previewer__code-pointer"
                        aria-label={`Error column ${error.columnNumber}`}
                        style={{ paddingLeft: `calc(14px + ${Math.max(0, error.columnNumber - 1)}ch)` }}
                      >^</span>
                    )}
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
