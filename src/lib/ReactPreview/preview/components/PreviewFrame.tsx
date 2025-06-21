// components/PreviewFrame.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { SourceInfo } from '../types';
import { FileProcessor } from '../utils/FileProcessor';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTMLGenerator } from '../utils/HTMLGenerator';
import { MessageHandler } from '../utils/MessageHandler';
import { LoadingOverlay } from './LoadingOverlay';

export interface PreviewFrameProps {
  files: Record<string, string>;
  entryFile: string;
  depsInfo?: Record<string, any>;
  onError?: (error: Error) => void;
  onElementClick?: (sourceInfo: SourceInfo) => void;
  isInspecting?: boolean;
  onInspectToggle?: (enabled: boolean) => void;
  key?: string | number;
}

// 使用 React.memo 避免不必要的重新渲染
export const PreviewFrame: React.FC<PreviewFrameProps> = React.memo(({
  files,
  entryFile,
  depsInfo = {},
  onError,
  onElementClick,
  isInspecting = false,
  onInspectToggle
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<{
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
    codeFrame?: string;
  } | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileProcessor = useRef(new FileProcessor());
  const errorHandler = useRef(new ErrorHandler());
  const htmlGenerator = useRef(new HTMLGenerator());
  const messageHandler = useRef<MessageHandler>(null);
  
  // 使用 useRef 跟踪当前处理的文件内容
  const currentFilesRef = useRef<string>('');
  const currentEntryFileRef = useRef<string>('');
  const currentDepsInfoRef = useRef<string>('');
  
  // 使用 useRef 稳定回调函数的引用
  const onElementClickRef = useRef(onElementClick);
  const onErrorRef = useRef(onError);
  const onInspectToggleRef = useRef(onInspectToggle);
  
  onElementClickRef.current = onElementClick;
  onErrorRef.current = onError;
  onInspectToggleRef.current = onInspectToggle;

  const handleElementClick = useCallback((data: { 
    file: string; 
    startLine: number;  
    endLine: number; 
    startColumn: number; 
    endColumn: number; 
    x: number; 
    y: number 
  }) => {
    try {
      console.log('Element clicked:', data, 'isInspecting:', isInspecting);
      
      if (!isInspecting) {
        console.log('Not in inspecting mode, ignoring click');
        return;
      }

      if (!data || !data.file || !data.startLine || !data.endLine || !data.startColumn || !data.endColumn) {
        console.log('Missing file or line data');
        return;
      }

      const fileContent = files[data.file];
      if (!fileContent) {
        console.log('File content not found for:', data.file);
        return;
      }

      console.log('Processing file content for:', data.file);
      const lines = fileContent.split('\n');
      
      // 边界检查：确保行号在有效范围内
      const maxLine = lines.length;
      const startLine = Math.max(1, Math.min(data.startLine, maxLine));
      const endLine = Math.max(1, Math.min(data.endLine, maxLine));
      
      console.log(`Line range: ${startLine}-${endLine}, max lines: ${maxLine}`);
      
      let textStr = '';
      if (startLine === endLine) {
        // 单行
        const line = lines[startLine - 1];
        if (line) {
          const maxColumn = line.length;
          const startColumn = Math.max(0, Math.min(data.startColumn, maxColumn));
          const endColumn = Math.max(startColumn, Math.min(data.endColumn, maxColumn));
          textStr = line.slice(startColumn, endColumn);
        }
      } else {
        // 多行
        for (let i = startLine - 1; i < endLine; i++) {
          const line = lines[i];
          if (line) {
            if (i === startLine - 1) {
              // 第一行：从 startColumn 开始
              const maxColumn = line.length;
              const startColumn = Math.max(0, Math.min(data.startColumn, maxColumn));
              textStr += line.slice(startColumn) + '\n';
            } else if (i === endLine - 1) {
              // 最后一行：到 endColumn 结束
              const maxColumn = line.length;
              const endColumn = Math.max(0, Math.min(data.endColumn, maxColumn));
              textStr += line.slice(0, endColumn);
            } else {
              // 中间行：完整行
              textStr += line + '\n';
            }
          }
        }
      }

      console.log("text Str is: ", textStr);

      const newSourceInfo: SourceInfo = {
        file: data.file,
        startLine: startLine,
        endLine: endLine,
        startColumn: data.startColumn,
        endColumn: data.endColumn,
        content: textStr,
        position: { x: data.x, y: data.y }
      };

      console.log('Setting source info:', newSourceInfo);
      
      // 调用外部回调函数，透传源代码位置信息
      if (onElementClickRef.current) {
        onElementClickRef.current(newSourceInfo);
      }
    } catch (error) {
      console.error('Error in handleElementClick:', error);
    }
  }, [files, isInspecting]);

  // 初始化消息处理器
  useEffect(() => {
    messageHandler.current = new MessageHandler(errorHandler.current, {
      onError: (errorInfo) => {
        setError(errorInfo.message);
        setErrorDetails({
          fileName: errorInfo.fileName,
          lineNumber: errorInfo.lineNumber,
          columnNumber: errorInfo.columnNumber,
          codeFrame: errorInfo.codeFrame
        });
        if (onErrorRef.current) {
          onErrorRef.current(new Error(errorInfo.message));
        }
      },
      onElementClick: handleElementClick,
    });
  }, [handleElementClick]);

  const processFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorDetails(null);

      await fileProcessor.current.initialize();
      const fileUrls = await fileProcessor.current.processFiles(files, depsInfo);
      console.log('processFiles=======')
      // fileUrls: Map<fileName, blobUrl>
      errorHandler.current.setBlobToFileMap(fileUrls);
      renderPreview(fileUrls, entryFile);
    } catch (err) {
      const compileError = errorHandler.current.processCompileError(
        err instanceof Error ? err : new Error('Unknown error')
      );
      setError(compileError.message);
      setErrorDetails({
        fileName: compileError.fileName,
        lineNumber: compileError.lineNumber,
        columnNumber: compileError.columnNumber,
        codeFrame: compileError.codeFrame
      });
      if (onErrorRef.current) {
        onErrorRef.current(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []); // 移除依赖项，使用 ref 来访问最新的值

  // 创建一个内部函数来处理文件，可以访问最新的 props
  const processFilesInternal = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setErrorDetails(null);

      await fileProcessor.current.initialize();
      const fileUrls = await fileProcessor.current.processFiles(files, depsInfo);
      console.log('processFiles=======')
      // fileUrls: Map<fileName, blobUrl>
      errorHandler.current.setBlobToFileMap(fileUrls);
      renderPreview(fileUrls, entryFile);
    } catch (err) {
      const compileError = errorHandler.current.processCompileError(
        err instanceof Error ? err : new Error('Unknown error')
      );
      setError(compileError.message);
      setErrorDetails({
        fileName: compileError.fileName,
        lineNumber: compileError.lineNumber,
        columnNumber: compileError.columnNumber,
        codeFrame: compileError.codeFrame
      });
      if (onErrorRef.current) {
        onErrorRef.current(err instanceof Error ? err : new Error('Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [files, depsInfo, entryFile]);

  // 检查文件内容是否真正改变
  useEffect(() => {
    const filesKey = JSON.stringify(Object.keys(files).sort());
    const depsInfoKey = JSON.stringify(Object.keys(depsInfo || {}).sort());
    
    const newFilesKey = filesKey;
    const newEntryFile = entryFile;
    const newDepsInfoKey = depsInfoKey;
    
    // 只有当文件内容真正改变时才重新处理
    if (
      currentFilesRef.current !== newFilesKey ||
      currentEntryFileRef.current !== newEntryFile ||
      currentDepsInfoRef.current !== newDepsInfoKey
    ) {
      console.log('PreviewFrame: File content changed, reprocessing files');
      currentFilesRef.current = newFilesKey;
      currentEntryFileRef.current = newEntryFile;
      currentDepsInfoRef.current = newDepsInfoKey;
      
      // 使用 setTimeout 确保在下一个事件循环中执行，避免在渲染过程中处理文件
      setTimeout(() => {
        processFilesInternal();
      }, 0);
    }
  }, [files, entryFile, depsInfo, processFilesInternal]);

  // 监听iframe内的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.source !== iframeRef.current?.contentWindow) return;
        console.log('Received message:', event.data);
        
        // 处理 iframe 请求检查模式状态的消息
        if (event.data.type === 'request-inspect-state') {
          console.log('Iframe requested inspect state, sending:', isInspecting);
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
              type: 'toggle-inspect',
              enabled: isInspecting
            }, '*');
          }
          return;
        }
        
        messageHandler.current?.handleMessage(event);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isInspecting]);

  const renderPreview = (fileUrls: Map<string, string>, entry: string) => {
    if (!iframeRef.current) return;

    const entryUrl = fileUrls.get(entry);
    if (!entryUrl) {
      throw new Error(`Entry file ${entry} not found`);
    }

    const html = htmlGenerator.current.generatePreviewHTML(entryUrl);
    const htmlBlob = new Blob([html], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    iframeRef.current.src = htmlUrl;
  };

  // 监听检查模式变化，同步到 iframe
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'toggle-inspect',
        enabled: isInspecting
      }, '*');
    }
  }, [isInspecting]);

  // 清理资源
  useEffect(() => {
    return () => {
      fileProcessor.current.cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {isLoading && <LoadingOverlay />}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto">
          <div className="text-red-800 font-medium mb-2">编译错误:</div>
          
          {/* 错误位置信息 */}
          {errorDetails?.fileName && (
            <div className="text-red-700 text-sm mb-2">
              <span className="font-medium">文件:</span> {errorDetails.fileName}
              {errorDetails.lineNumber && (
                <span className="ml-4">
                  <span className="font-medium">行:</span> {errorDetails.lineNumber}
                  {errorDetails.columnNumber && (
                    <span className="ml-2">
                      <span className="font-medium">列:</span> {errorDetails.columnNumber}
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
          
          {/* 错误消息 */}
          <div className="text-red-600 text-sm whitespace-pre-wrap mb-3">{error}</div>
          
          {/* 代码框架 */}
          {errorDetails?.codeFrame && (
            <div className="bg-gray-100 p-3 rounded border text-xs font-mono overflow-x-auto">
              <pre className="text-gray-800 whitespace-pre">{errorDetails.codeFrame}</pre>
            </div>
          )}
        </div>
      )}

      <iframe
        ref={iframeRef}
        className={`w-full h-full border-none transition-opacity duration-200 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // 检查 isInspecting 状态变化 - 如果检查模式状态改变，需要重新渲染
  if (prevProps.isInspecting !== nextProps.isInspecting) {
    console.log('PreviewFrame: Re-rendering due to inspect mode change');
    return false; // false 表示需要重新渲染
  }
  
  // 自定义比较函数，只在关键 props 改变时才重新渲染
  const prevKey = JSON.stringify({
    files: Object.keys(prevProps.files).sort(),
    entryFile: prevProps.entryFile,
    depsInfo: Object.keys(prevProps.depsInfo || {}).sort()
  });
  
  const nextKey = JSON.stringify({
    files: Object.keys(nextProps.files).sort(),
    entryFile: nextProps.entryFile,
    depsInfo: Object.keys(nextProps.depsInfo || {}).sort()
  });
  
  // 如果关键 props 没有改变，返回 true 表示不需要重新渲染
  if (prevKey === nextKey) {
    console.log('PreviewFrame: Skipping re-render, key props unchanged');
    return true; // true 表示 props 相等，不需要重新渲染
  }
  
  console.log('PreviewFrame: Re-rendering due to key props change');
  return false; // false 表示 props 不相等，需要重新渲染
}); 