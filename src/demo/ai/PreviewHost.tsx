import { useEffect, useState } from 'react';
import { ReactPreviewer } from '../../lib/ReactPreview';
import { parseFiles, type GeneratedFiles } from './protocol';

export default function PreviewHost() {
  const [snapshot, setSnapshot] = useState<{
    id: number;
    files: GeneratedFiles;
  } | null>(null);
  const hostOrigin =
    import.meta.env.VITE_AI_HOST_ORIGIN || 'http://127.0.0.1:5173';
  useEffect(() => {
    if (hostOrigin === window.location.origin) return;
    const receive = (event: MessageEvent) => {
      if (
        event.source !== window.parent ||
        event.origin !== hostOrigin ||
        event.data?.type !== 'ai-preview-render'
      )
        return;
      if (!Number.isSafeInteger(event.data.id)) return;
      try {
        setSnapshot({
          id: event.data.id,
          files: parseFiles(JSON.stringify({ files: event.data.files }))
        });
      } catch {
        window.parent.postMessage(
          {
            type: 'ai-preview-error',
            id: event.data.id,
            message: '预览文件格式无效'
          },
          hostOrigin
        );
      }
    };
    window.addEventListener('message', receive);
    window.parent.postMessage({ type: 'ai-preview-mounted' }, hostOrigin);
    return () => window.removeEventListener('message', receive);
  }, [hostOrigin]);
  return (
    snapshot && (
      <ReactPreviewer
        files={snapshot.files}
        entryFile="App.tsx"
        onStatusChange={(status) => {
          if (status.phase === 'ready')
            window.parent.postMessage(
              { type: 'ai-preview-ready', id: snapshot.id },
              hostOrigin
            );
        }}
        onError={(_, info) =>
          window.parent.postMessage(
            {
              type: 'ai-preview-error',
              id: snapshot.id,
              message: info.message
            },
            hostOrigin
          )
        }
      />
    )
  );
}
