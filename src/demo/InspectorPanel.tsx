import type { SourceInfo } from '../lib/ReactPreview';

interface InspectorPanelProps {
  sourceInfo: SourceInfo | null;
  onClose: () => void;
}

export function InspectorPanel({ sourceInfo, onClose }: InspectorPanelProps) {
  if (!sourceInfo) return null;

  return (
    <aside className="inspector-panel" aria-label="元素源码位置">
      <header>
        <div>
          <span className="demo-eyebrow">Inspector</span>
          <strong>{sourceInfo.file}</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="关闭源码面板">×</button>
      </header>
      <div className="inspector-panel__meta">
        <span>Line {sourceInfo.startLine}:{sourceInfo.startColumn}</span>
        <span>→ {sourceInfo.endLine}:{sourceInfo.endColumn}</span>
      </div>
      <pre>{sourceInfo.content}</pre>
    </aside>
  );
}
