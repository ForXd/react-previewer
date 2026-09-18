import { useState } from 'react';
import { version } from '../../package.json';
import { useDemoWorkspace } from './useDemoWorkspace';
import {
  compilers,
  type CompilerMode,
  type PreviewSkin,
  type ViewportName,
  type WorkbenchView
} from './workbenchConfig';
import { ExampleSidebar } from './components/ExampleSidebar';
import { WorkbenchToolbar } from './components/WorkbenchToolbar';
import { CodeWorkspace } from './components/CodeWorkspace';
import { PreviewWorkspace } from './components/PreviewWorkspace';
import { StatusBar } from './components/StatusBar';
import { TabList } from './components/TabList';
import { Icon } from './components/Icon';

export default function DemoWorkbench() {
  const workspace = useDemoWorkspace();
  const [compiler, setCompiler] = useState<CompilerMode>('babel');
  const [skin, setSkin] = useState<PreviewSkin>('paper');
  const [viewport, setViewport] = useState<ViewportName>('responsive');
  const [view, setView] = useState<WorkbenchView>('editor');
  const [isInspecting, setIsInspecting] = useState(false);
  const { demo } = workspace;

  return (
    <div className={`demo-app demo-app--${skin}`}>
      <header className="demo-header">
        <a
          className="demo-brand"
          href="#top"
          aria-label="React Previewer demo 首页"
        >
          <span className="brand-symbol">
            <Icon name="code" />
          </span>
          <strong>React Previewer</strong>
          <span className="brand-divider" />
          <small>Playground</small>
        </a>
        <div className="demo-header__meta">
          <span className="demo-version">v{version}</span>
          <a
            href="https://github.com/ForXd/react-previewer"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Icon name="arrow" />
          </a>
        </div>
      </header>
      <div className="demo-layout" id="top">
        <ExampleSidebar
          selectedId={demo.id}
          onSelect={(id) => {
            workspace.selectDemo(id);
            setIsInspecting(false);
          }}
        />
        <main className="demo-main">
          <div className="workspace-heading">
            <div>
              <span className="workspace-breadcrumb">
                示例 <span>/</span> <strong>{demo.title}</strong>
              </span>
              <p>{demo.description}</p>
            </div>
            <span className="language-badge">{demo.category}</span>
          </div>
          <section className="workbench" aria-label="React Previewer 工作台">
            <div className="workbench-topbar">
              <TabList
                label="工作台视图"
                value={view}
                onChange={setView}
                className="workbench-view-tabs"
                items={[
                  {
                    value: 'editor',
                    label: '编辑器',
                    icon: <Icon name="code" />,
                    id: 'editor-tab',
                    panelId: 'editor-panel'
                  },
                  {
                    value: 'preview',
                    label: '预览',
                    icon: <Icon name="preview" />,
                    id: 'preview-tab',
                    panelId: 'preview-panel'
                  }
                ]}
              />
              <span className="workspace-hint">编辑代码，即刻预览</span>
            </div>
            <WorkbenchToolbar
              isInspecting={isInspecting}
              isDirty={workspace.isDirty}
              compiler={compiler}
              skin={skin}
              viewport={viewport}
              onCompiler={setCompiler}
              onSkin={setSkin}
              onViewport={(next) => {
                setViewport(next);
                setView('preview');
              }}
              onRefresh={workspace.refresh}
              onReset={workspace.reset}
              onInspect={() => {
                setIsInspecting(!isInspecting);
                workspace.setSourceInfo(null);
                setView('preview');
              }}
            />
            <div
              id="editor-panel"
              role="tabpanel"
              aria-labelledby="editor-tab"
              hidden={view !== 'editor'}
            >
              <CodeWorkspace
                demo={demo}
                files={workspace.files}
                activeFile={workspace.activeFile}
                error={workspace.status?.error ?? null}
                skin={skin}
                sourceInfo={workspace.sourceInfo}
                onSelectFile={workspace.openFile}
                onChange={workspace.updateFile}
              />
            </div>
            <div
              id="preview-panel"
              role="tabpanel"
              aria-labelledby="preview-tab"
              hidden={view !== 'preview'}
            >
              <PreviewWorkspace
                runtimeKey={workspace.runtimeKey}
                skin={skin}
                viewport={viewport}
                routeInput={workspace.routeInput}
                onRouteInput={workspace.setRouteInput}
                onNavigate={workspace.navigate}
                sourceInfo={workspace.sourceInfo}
                onCloseInspector={() => workspace.setSourceInfo(null)}
                onOpenSource={() => {
                  if (workspace.sourceInfo)
                    workspace.openFile(workspace.sourceInfo.file);
                  setView('editor');
                }}
                previewProps={{
                  files: workspace.files,
                  entryFile: demo.entryFile,
                  depsInfo: demo.depsInfo,
                  dependencyStyles: demo.dependencyStyles,
                  compiler: compilers[compiler],
                  initialPath: workspace.path,
                  isInspecting,
                  iframeTitle: `${demo.title} preview`,
                  onElementClick: workspace.setSourceInfo,
                  onRouteChange: (route) => workspace.navigate(route.href),
                  onStatusChange: workspace.receiveStatus
                }}
              />
            </div>
            <StatusBar
              status={workspace.status}
              compiler={compiler}
              isDirty={workspace.isDirty}
              fileCount={Object.keys(workspace.files).length}
            />
          </section>
          <p className="workspace-footnote">
            自由修改示例，探索组件的每一种可能。
            <span>草稿仅在当前页面会话中保留</span>
          </p>
        </main>
      </div>
    </div>
  );
}
