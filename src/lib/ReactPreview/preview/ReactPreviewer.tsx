// ReactPreviewer.tsx (添加错误边界)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactPreviewerProps, ErrorInfo, SourceInfo } from './types';
import { FileProcessor } from './utils/FileProcessor';
import { ErrorHandler } from './utils/ErrorHandler';
import { HTMLGenerator } from './utils/HTMLGenerator';
import { MessageHandler } from './utils/MessageHandler';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SourceTooltip } from './components/SourceTooltip';
import { PreviewerToolbar } from './components/PreviewerToolbar';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';

export const ReactPreviewer: React.FC<ReactPreviewerProps> = ({ 
  files, 
  entryFile = 'App.tsx', 
  onError, 
  depsInfo 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transformedFiles, setTransformedFiles] = useState<Map<string, string>>(new Map());
  const [error, setError] = useState<ErrorInfo | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileProcessor = useRef(new FileProcessor());
  const errorHandler = useRef(new ErrorHandler());
  const htmlGenerator = useRef(new HTMLGenerator());
  const messageHandler = useRef<MessageHandler>(null);

  const handleElementClick = useCallback((data: { file: string; startLine: number;  endLine: number; startColumn: number; endColumn: number; x: number; y: number }) => {
    try {
      console.log('Element clicked:', data, 'isInspecting:', isInspecting);
      
      if (!isInspecting) {
        console.log('Not in inspecting mode, ignoring click');
        return;
      }

      if (!data || !data.file || !data.startLine || !data.endLine || !data.startColumn || !data.endColumn) {
        console.log('Missing file or line data');
        setSourceInfo(null);
        return;
      }

      const fileContent = files[data.file];
      if (!fileContent) {
        console.log('File content not found for:', data.file);
        setSourceInfo(null);
        return;
      }

      console.log('Processing file content for:', data.file);
      const lines = fileContent.split('\n');
      let textStr = '';

      console.log('lines', lines[data.startLine - 1]);
      
      for (let i = data.startLine; i < data.endLine; i++) {
        if (i === data.startLine) {
        //   textStr += lines[i].slice(data.startColumn);
          textStr += lines[i];

        } else if (i === data.endLine - 1) {
        //   textStr += lines[i].slice(0, data.endColumn);
          textStr += lines[i];

        } else {
          textStr += lines[i];
        }
      }

      console.log("text Str is: ", textStr)

      const newSourceInfo: SourceInfo = {
        file: data.file,
        startLine: data.startLine,
        endLine: data.endLine,
        startColumn: data.startColumn,
        endColumn: data.endColumn,
        content: textStr,
        position: { x: data.x, y: data.y }
      };

      console.log('Setting source info:', newSourceInfo);
      setSourceInfo(newSourceInfo);
    } catch (error) {
      console.error('Error in handleElementClick:', error);
    }
  }, [files, isInspecting]);

  // 初始化消息处理器
  useEffect(() => {
    messageHandler.current = new MessageHandler(errorHandler.current, {
      onError: (err) => {
        try {
          const errorInfo = errorHandler.current.processRuntimeError(err);
          setError(errorInfo);
          onError?.(err);
        } catch (error) {
          console.error('Error in onError callback:', error);
        }
      },
      onElementClick: handleElementClick,
    });
  }, [handleElementClick, onError]);

  useEffect(() => {
    processFiles();
  }, [files]);

  // 监听iframe内的消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.source !== iframeRef.current?.contentWindow) return;
        console.log('Received message:', event.data);
        messageHandler.current?.handleMessage(event);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 点击外部区域关闭浮窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceInfo && !event.defaultPrevented) {
        console.log('Closing source info due to outside click');
        setSourceInfo(null);
      }
    };

    if (sourceInfo) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sourceInfo]);

  const processFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSourceInfo(null);

      await fileProcessor.current.initialize();
      const fileUrls = await fileProcessor.current.processFiles(files, depsInfo);
      
      errorHandler.current.setBlobToFileMap(fileUrls);
      setTransformedFiles(fileUrls);
      renderPreview(fileUrls, entryFile);
    } catch (err) {
      const compileError = errorHandler.current.processCompileError(
        err instanceof Error ? err : new Error('Unknown error')
      );
      setError(compileError);
      onError?.(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

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

  const toggleInspect = useCallback(() => {
    const newInspectState = !isInspecting;
    console.log('Toggling inspect mode:', newInspectState);
    setIsInspecting(newInspectState);
    setSourceInfo(null);
    
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'toggle-inspect',
        enabled: newInspectState
      }, '*');
    }
  }, [isInspecting]);

  useEffect(() => {
    return () => {
      fileProcessor.current.cleanup();
    };
  }, []);

  console.log('Render state:', { sourceInfo: !!sourceInfo, isInspecting });

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full w-full">
        <PreviewerToolbar
          isLoading={isLoading}
          isInspecting={isInspecting}
          onRecompile={processFiles}
          onToggleInspect={toggleInspect}
        />

        {error && <ErrorDisplay error={error} />}

        <div className="flex-1 relative w-full">
          {isLoading && <LoadingOverlay />}

          <iframe
            ref={iframeRef}
            className={`w-full h-full border-none transition-opacity duration-200 ${
              isLoading ? 'opacity-50' : 'opacity-100'
            }`}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        {sourceInfo && (
          <ErrorBoundary>
            <SourceTooltip
              sourceInfo={sourceInfo}
              onClose={() => {
                console.log('Closing source tooltip');
                setSourceInfo(null);
              }}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
};