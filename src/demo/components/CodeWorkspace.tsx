import { lazy, Suspense } from 'react';
import type { ErrorInfo, SourceInfo } from '../../lib/ReactPreview';
import type { DemoDefinition } from '../demoCatalog';
import type { PreviewSkin } from '../workbenchConfig';
import { TabList } from './TabList';
import { Icon } from './Icon';

const MonacoCodeEditor = lazy(() =>
  import('../MonacoCodeEditor').then((module) => ({
    default: module.MonacoCodeEditor
  }))
);

interface CodeWorkspaceProps {
  demo: DemoDefinition;
  files: Record<string, string>;
  activeFile: string;
  error: ErrorInfo | null;
  skin: PreviewSkin;
  sourceInfo: SourceInfo | null;
  onSelectFile: (file: string) => void;
  onChange: (value: string) => void;
}

export function CodeWorkspace({
  demo,
  files,
  activeFile,
  error,
  skin,
  sourceInfo,
  onSelectFile,
  onChange
}: CodeWorkspaceProps) {
  return (
    <section className="code-workspace" aria-label="多文件编辑器">
      <div className="code-workspace__tabs">
        <TabList
          label="示例文件"
          value={activeFile}
          onChange={onSelectFile}
          className="code-file-tabs"
          items={Object.keys(files).map((file, index) => ({
            value: file,
            label: file,
            icon: file.endsWith('.css') ? (
              <span className="css-icon" aria-hidden="true">
                #
              </span>
            ) : (
              <Icon name="code" />
            ),
            changed: files[file] !== demo.files[file],
            panelId: 'code-file-panel',
            id: `code-file-tab-${index}`
          }))}
        />
        <span className="editor-auto">
          <span className="status-dot status-dot--ready" />
          自动编译
        </span>
      </div>
      <div
        className="code-editor-shell"
        id="code-file-panel"
        role="tabpanel"
        aria-labelledby={`code-file-tab-${Object.keys(files).indexOf(activeFile)}`}
      >
        <Suspense
          fallback={<div className="code-editor-loading">正在载入编辑器…</div>}
        >
          <MonacoCodeEditor
            demoId={demo.id}
            fileName={activeFile}
            value={files[activeFile] ?? ''}
            error={error}
            onChange={onChange}
            theme={skin === 'paper' ? 'vs' : 'vs-dark'}
            sourceInfo={sourceInfo}
          />
        </Suspense>
      </div>
      <footer className="code-workspace__footer">
        <span>
          <Icon name="code" />
          {activeFile.endsWith('.css') ? 'CSS' : 'TypeScript JSX'}
        </span>
        <span>
          {(files[activeFile] ?? '').split('\n').length} 行
          <span className="footer-divider" />
          UTF-8
          <span className="footer-divider" />
          Spaces: 2
        </span>
      </footer>
    </section>
  );
}
