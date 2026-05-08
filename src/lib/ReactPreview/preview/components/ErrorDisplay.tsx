// components/ErrorDisplay.tsx
import React, { useState, useEffect } from 'react';
import type { ErrorInfo } from '../types';
import { createModuleLogger } from '../utils/Logger';

const logger = createModuleLogger('ErrorDisplay');

interface ErrorDisplayProps {
  error: ErrorInfo;
  files?: Record<string, string>;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, files }) => {
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [errorLine, setErrorLine] = useState<number | null>(null);

  useEffect(() => {
    logger.debug("error: =======", error);
    if (error.type === 'compile' && error.fileName && error.lineNumber && files && files[error.fileName]) {
      const lines = files[error.fileName].split('\n');
      const start = Math.max(0, error.lineNumber - 4);
      const end = Math.min(lines.length, error.lineNumber + 3);
      setCodeLines(lines.slice(start, end));
      setErrorLine(error.lineNumber - start - 1);
    } else {
      setCodeLines([]);
      setErrorLine(null);
    }
  }, [error, files]);

  return (
    <div className="mx-4 my-3 overflow-hidden rounded-lg bg-white shadow-[0_0_0_1px_rgba(255,91,79,0.22),0_2px_2px_rgba(0,0,0,0.04)]">
      <div className="border-b border-[#ffe1de] bg-[#fff7f6] px-4 py-3">
        <div className="flex items-center">
          <svg className="mr-2 h-5 w-5 flex-shrink-0 text-[#ff5b4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-[#c73a31]">
            {error.type === 'compile' ? '编译错误' : '运行时错误'}
          </h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="mb-2 text-sm font-medium text-[#4d4d4d]">错误信息:</div>
          <div className="rounded-md bg-[#fff7f6] p-3 shadow-[0_0_0_1px_rgba(255,91,79,0.18)]">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#c73a31]">
              {error.message}
            </pre>
          </div>
        </div>
        
        {/* 源码片段展示 */}
        {error.type === 'compile' && error.codeFrame ? (
          <div>
            <div className="mb-1 text-xs text-[#666666]">{error.fileName}{typeof error.lineNumber === 'number' ? ` (第${error.lineNumber}行)` : ''}</div>
            <pre className="overflow-auto rounded-md bg-[#171717] p-3 font-mono text-xs leading-6 whitespace-pre-wrap text-[#fafafa] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" dangerouslySetInnerHTML={{ __html: error.codeFrame }} />
          </div>
        ) : error.type === 'compile' && error.fileName && typeof error.lineNumber === 'number' && codeLines.length > 0 && (
          <div>
            <div className="mb-1 text-xs text-[#666666]">{error.fileName} (第{error.lineNumber}行)</div>
            <div className="flex overflow-auto rounded-md bg-[#171717] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
              <div className="select-none border-r border-white/10 bg-black px-2 py-2 text-right text-[#808080]">
                {codeLines.map((_, i) => (
                  <div key={i} className={`h-6 leading-6 ${i === errorLine ? 'font-semibold text-[#ff5b4f]' : ''}`}>{(error.lineNumber ?? 0) - (errorLine ?? 0) + i}</div>
                ))}
              </div>
              <pre className="m-0 min-w-[60px] bg-transparent px-3 py-2 font-mono text-xs leading-6 whitespace-pre text-[#fafafa]">
                {codeLines.map((line, i) => (
                  <div key={i} className={i === errorLine ? 'rounded bg-[#ff5b4f]/20 text-[#ffd4d1]' : ''}>{line}</div>
                ))}
              </pre>
            </div>
          </div>
        )}
        
        {error.fileName && (
          <div className="flex items-center text-sm">
            <svg className="mr-2 h-4 w-4 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-[#4d4d4d]">
              <span className="font-medium">文件:</span> {error.fileName}
              {error.lineNumber && (
                <span className="ml-2 text-[#666666]">
                  行: {error.lineNumber}, 列: {error.columnNumber}
                </span>
              )}
            </span>
          </div>
        )}
        
        {error.stack && (
          <div>
            <button
              onClick={() => setIsStackExpanded(!isStackExpanded)}
              className="flex items-center text-sm font-medium text-[#4d4d4d] transition-colors hover:text-[#171717]"
            >
              <svg 
                className={`w-4 h-4 mr-2 transition-transform ${isStackExpanded ? 'rotate-90' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              错误堆栈
            </button>
            
            {isStackExpanded && (
              <div className="mt-2 max-h-64 overflow-auto rounded-md bg-[#171717] p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-[#fafafa]">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
