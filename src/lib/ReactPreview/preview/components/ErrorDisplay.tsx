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
    <div className="mx-4 my-3 bg-red-50 border border-red-200 rounded-lg overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-red-100 border-b border-red-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-red-800 font-semibold text-sm">
            {error.type === 'compile' ? '编译错误' : '运行时错误'}
          </h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">错误信息:</div>
          <div className="bg-white border border-red-200 rounded-md p-3">
            <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono leading-relaxed">
              {error.message}
            </pre>
          </div>
        </div>
        
        {/* 源码片段展示 */}
        {error.type === 'compile' && error.codeFrame ? (
          <div>
            <div className="text-xs text-gray-500 mb-1">{error.fileName}{typeof error.lineNumber === 'number' ? ` (第${error.lineNumber}行)` : ''}</div>
            <pre className="bg-[#23272e] text-xs text-gray-100 rounded-md p-3 overflow-auto border border-gray-700 font-mono leading-6 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: error.codeFrame }} />
          </div>
        ) : error.type === 'compile' && error.fileName && typeof error.lineNumber === 'number' && codeLines.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-1">{error.fileName} (第{error.lineNumber}行)</div>
            <div className="flex bg-[#23272e] rounded-md overflow-auto border border-gray-700">
              <div className="py-2 px-2 text-right select-none bg-[#20232a] text-gray-500 border-r border-gray-700">
                {codeLines.map((_, i) => (
                  <div key={i} className={`leading-6 h-6 ${i === errorLine ? 'text-red-400 font-bold' : ''}`}>{(error.lineNumber ?? 0) - (errorLine ?? 0) + i}</div>
                ))}
              </div>
              <pre className="py-2 px-3 m-0 whitespace-pre leading-6 text-xs bg-transparent font-mono min-w-[60px]">
                {codeLines.map((line, i) => (
                  <div key={i} className={i === errorLine ? 'bg-red-900/40 text-red-200 rounded' : ''}>{line}</div>
                ))}
              </pre>
            </div>
          </div>
        )}
        
        {error.fileName && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">
              <span className="font-medium">文件:</span> {error.fileName}
              {error.lineNumber && (
                <span className="text-gray-500 ml-2">
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
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
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
              <div className="mt-2 bg-gray-900 border border-gray-300 rounded-md p-3 max-h-64 overflow-auto">
                <pre className="text-xs text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
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