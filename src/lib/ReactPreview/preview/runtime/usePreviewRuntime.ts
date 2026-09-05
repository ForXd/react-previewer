import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ErrorInfo, PreviewStatus, ReactPreviewerProps } from '../types';
import { getPreviewCompilerConfigKey } from '../compilers';
import { createSourceAttributeKey } from '../sourceAttributes';
import {
  createDepsHash,
  createFilesHash,
  createStylesHash
} from '../utils/contentHash';
import { ErrorHandler } from '../utils/ErrorHandler';
import { HTMLGenerator } from '../utils/HTMLGenerator';
import { MessageHandler } from '../utils/MessageHandler';
import { createSourceInfo } from '../utils/sourceSelection';
import { createModuleLogger } from '../utils/Logger';
import { CompilationSession } from './CompilationSession';
import {
  createInitialStatus,
  normalizePreviewPath,
  resourceStatus,
  toRouteState
} from './previewState';

const logger = createModuleLogger('PreviewRuntime');
type PreviewDocument = { version: number; html: string };

/** Connects the compilation session and iframe protocol to one status snapshot. */
export function usePreviewRuntime(props: ReactPreviewerProps) {
  const latest = useRef(props);
  useLayoutEffect(() => {
    latest.current = props;
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const sessionRef = useRef<CompilationSession | null>(null);
  const errorHandler = useRef(new ErrorHandler());
  const [status, setStatus] = useState(createInitialStatus);
  const statusRef = useRef(status);
  const [document, setDocument] = useState<PreviewDocument>({
    version: 0,
    html: ''
  });
  const acceptsMessages = useRef(false);

  const publish = useCallback((next: Partial<PreviewStatus>) => {
    const snapshot = { ...statusRef.current, ...next };
    statusRef.current = snapshot;
    setStatus(snapshot);
    latest.current.onStatusChange?.(snapshot);
  }, []);

  const reportError = useCallback(
    (info: ErrorInfo, error = new Error(info.message)) => {
      publish({
        isLoading: false,
        phase: 'error',
        error: info,
        currentResource: undefined
      });
      latest.current.onError?.(error, info);
    },
    [publish]
  );

  useEffect(() => {
    const session = new CompilationSession();
    sessionRef.current = session;
    return () => {
      acceptsMessages.current = false;
      sessionRef.current = null;
      void session
        .dispose()
        .catch((error: unknown) => logger.error('Cleanup failed', error));
    };
  }, []);

  const compileKey = JSON.stringify([
    createFilesHash(props.files),
    props.entryFile ?? 'App.tsx',
    createDepsHash(props.depsInfo),
    createStylesHash(props.dependencyStyles),
    getPreviewCompilerConfigKey(props.compiler),
    createSourceAttributeKey(props.sourceAttributeNames),
    props.enableTailwind ?? false
  ]);
  const compileDelay = props.compileDelay ?? 120;

  useEffect(() => {
    const session = sessionRef.current!;
    const input = latest.current;
    let cancelled = false;
    acceptsMessages.current = false;
    session.invalidate();
    publish(createInitialStatus());

    const timer = window.setTimeout(
      async () => {
        const startedAt = performance.now();
        try {
          const result = await session.compile(
            {
              files: input.files,
              entryFile: input.entryFile ?? 'App.tsx',
              depsInfo: input.depsInfo ?? {},
              sourceAttributeNames: input.sourceAttributeNames
            },
            input.compiler
          );
          if (cancelled || !result) return;
          const entryUrl = result.fileUrls.get(result.entryFile);
          if (!entryUrl)
            throw new Error(`Entry file ${result.entryFile} not found`);
          const html = new HTMLGenerator().generatePreviewHTML(
            entryUrl,
            input.depsInfo ?? {},
            input.dependencyStyles ?? {},
            normalizePreviewPath(latest.current.initialPath),
            input.sourceAttributeNames,
            input.enableTailwind ?? false
          );
          errorHandler.current.setBlobToFileMap(
            result.fileUrls,
            result.sourceMaps
          );
          setDocument((previous) => ({ version: previous.version + 1, html }));
          publish({
            phase: 'loading-js',
            compileDuration: Math.round(performance.now() - startedAt),
            transformedFiles: result.transformedFiles
          });
        } catch (error) {
          if (cancelled) return;
          const failure =
            error instanceof Error ? error : new Error(String(error));
          reportError(
            errorHandler.current.processCompileError(failure),
            failure
          );
        }
      },
      Math.max(0, compileDelay)
    );
    return () => {
      cancelled = true;
      session.invalidate();
      window.clearTimeout(timer);
    };
    // Props are captured by content key; callbacks, routes and styling never
    // cancel or restart compilation merely because their identities changed.
  }, [compileKey, compileDelay, publish, reportError]);

  useEffect(() => {
    const handler = new MessageHandler(errorHandler.current, {
      onError: reportError,
      onDependencyError: reportError,
      onElementClick: (data) => {
        if (!latest.current.isInspecting) return;
        const source = createSourceInfo(data, latest.current.files);
        if (source) latest.current.onElementClick?.(source);
      }
    });
    const receive = (event: MessageEvent) => {
      if (
        !acceptsMessages.current ||
        event.source !== iframeRef.current?.contentWindow
      )
        return;
      if (
        !event.data ||
        typeof event.data !== 'object' ||
        typeof event.data.type !== 'string'
      )
        return;
      const data =
        event.data.data && typeof event.data.data === 'object'
          ? event.data.data
          : {};
      switch (event.data.type) {
        case 'request-inspect-state':
          iframeRef.current?.contentWindow?.postMessage(
            {
              type: 'toggle-inspect',
              enabled: latest.current.isInspecting ?? false
            },
            '*'
          );
          return;
        case 'resource-status':
          if (
            statusRef.current.phase === 'error' ||
            statusRef.current.phase === 'ready'
          )
            return;
          publish({
            ...resourceStatus(data),
            phase:
              data.phase === 'loading-css' || data.phase === 'rendering'
                ? data.phase
                : 'loading-js'
          });
          return;
        case 'preview-ready':
          // A late ready message must never erase a runtime/dependency error.
          if (statusRef.current.phase === 'error') return;
          publish({
            ...resourceStatus(data),
            phase: 'ready',
            isLoading: false,
            resourceProgress: 100,
            currentResource: undefined
          });
          return;
        case 'route-change':
          latest.current.onRouteChange?.(toRouteState(data));
          return;
        default:
          handler.handleMessage(event);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [publish, reportError]);

  const activateDocument = useCallback(() => {
    acceptsMessages.current = true;
  }, []);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'navigate-preview',
        path: normalizePreviewPath(props.initialPath)
      },
      '*'
    );
  }, [props.initialPath]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: 'toggle-inspect',
        enabled: props.isInspecting ?? false
      },
      '*'
    );
  }, [props.isInspecting]);

  return { iframeRef, document, status, activateDocument };
}
