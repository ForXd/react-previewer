import { useCallback, useEffect, useRef, useState } from 'react';
import type { GeneratedFiles } from './protocol';

type Snapshot = { id: number; files: GeneratedFiles };

function Candidate({
  snapshot,
  url,
  onReady,
  onError,
  visible
}: {
  snapshot: Snapshot;
  url: string;
  visible: boolean;
  onReady: (id: number) => void;
  onError: (message: string, id: number) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const origin = new URL(url).origin;
    let ready = false;
    const timer = window.setTimeout(() => {
      if (!ready)
        onError('预览加载超时，请检查独立预览服务和网络', snapshot.id);
    }, 45_000);
    const receive = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== origin
      )
        return;
      if (event.data?.type === 'ai-preview-mounted') {
        frame.current?.contentWindow?.postMessage(
          { type: 'ai-preview-render', ...snapshot },
          origin
        );
      }
      if (event.data?.id !== snapshot.id) return;
      if (event.data?.type === 'ai-preview-ready') {
        ready = true;
        clearTimeout(timer);
        onReady(snapshot.id);
      }
      if (
        event.data?.type === 'ai-preview-error' &&
        typeof event.data.message === 'string'
      ) {
        clearTimeout(timer);
        onError(event.data.message.slice(0, 1000), snapshot.id);
      }
    };
    window.addEventListener('message', receive);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('message', receive);
    };
  }, [snapshot, url, onReady, onError]);
  return (
    <iframe
      ref={frame}
      src={url}
      title={visible ? 'AI 生成页面预览' : '正在验证新页面'}
      sandbox="allow-scripts allow-same-origin"
      className={
        visible
          ? 'ai-preview-frame'
          : 'ai-preview-frame ai-preview-frame--pending'
      }
    />
  );
}

export function IsolatedPreview({
  snapshot,
  url,
  onError,
  onReady
}: {
  snapshot: Snapshot | null;
  url: string;
  onError: (message: string) => void;
  onReady: () => void;
}) {
  const [failedId, setFailedId] = useState<number | null>(null);
  const fail = useCallback(
    (message: string, id: number) => {
      setFailedId(id);
      onError(message);
    },
    [onError]
  );
  const [readyId, setReadyId] = useState<number | null>(null);
  const ready = useCallback(
    (id: number) => {
      setReadyId(id);
      onReady();
    },
    [onReady]
  );
  const [previous, setPrevious] = useState<Snapshot | null>(null);
  // Retain the last successfully mounted snapshot when a new candidate arrives.
  const [lastSnapshot, setLastSnapshot] = useState(snapshot);
  if (snapshot !== lastSnapshot) {
    if (lastSnapshot?.id === readyId) setPrevious(lastSnapshot);
    setLastSnapshot(snapshot);
  }
  const visible = snapshot?.id === readyId;
  return (
    <div className="ai-preview-area">
      {!snapshot && (
        <div className="ai-empty">
          <strong>从一句需求开始</strong>
          <p>描述布局、配色和交互，生成后会在这里展示页面。</p>
        </div>
      )}
      {previous && !visible && (
        <Candidate
          key={previous.id}
          snapshot={previous}
          url={url}
          visible
          onReady={ready}
          onError={fail}
        />
      )}
      {snapshot && (
        <Candidate
          key={snapshot.id}
          snapshot={snapshot}
          url={url}
          visible={visible}
          onReady={ready}
          onError={fail}
        />
      )}
      {snapshot && !visible && failedId !== snapshot.id && (
        <span className="ai-preview-loading" role="status">
          正在编译并验证新页面…
        </span>
      )}
    </div>
  );
}
