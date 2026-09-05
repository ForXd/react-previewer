import type { PreviewStatus } from '../../lib/ReactPreview';
import { statusLabels, type CompilerMode } from '../workbenchConfig';

export function StatusBar({
  status,
  compiler,
  isDirty,
  fileCount
}: {
  status: PreviewStatus | null;
  compiler: CompilerMode;
  isDirty: boolean;
  fileCount: number;
}) {
  const phase = status?.phase ?? 'compiling';
  return (
    <footer className="workbench-footer">
      <div className="workbench-status" role="status" aria-live="polite">
        <span className={`status-dot status-dot--${phase}`} />
        <strong>{statusLabels[phase]}</strong>
        {status?.compileDuration != null && (
          <span className="compile-duration">{status.compileDuration} ms</span>
        )}
      </div>
      <div className="workbench-footer__meta">
        <span>{fileCount} 个文件</span>
        <span>{compiler === 'babel' ? 'Babel' : 'Rspack'}</span>
        <span className={isDirty ? 'draft-label' : undefined}>
          {isDirty ? '草稿已保留' : '示例原始版本'}
        </span>
      </div>
    </footer>
  );
}
