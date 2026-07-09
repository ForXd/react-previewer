import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import {
  ReactPreviewer,
  type PreviewCompilerLike,
  type PreviewStatus,
  type ReactPreviewerClassNames,
  type ReactPreviewerStyles,
  type SourceInfo
} from '../lib/ReactPreview';
import rspackBrowserWorkerUrl from '../lib/ReactPreview/preview/compilers/rspackBrowser.worker.ts?worker&url';
import { demoCatalog } from './demoCatalog';
import { InspectorPanel } from './InspectorPanel';

type CompilerMode = 'babel' | 'rspack-browser';
type PreviewSkin = 'paper' | 'ink';
type ViewportName = 'responsive' | 'tablet' | 'mobile';

const viewports: Record<ViewportName, { label: string; width: CSSProperties['width']; height: number }> = {
  responsive: { label: '响应式', width: '100%', height: 640 },
  tablet: { label: '平板', width: 820, height: 700 },
  mobile: { label: '手机', width: 390, height: 720 }
};

const createInitialStatus = (): PreviewStatus => ({
  isLoading: true,
  phase: 'compiling',
  error: null,
  compileDuration: null,
  transformedFiles: 0,
  resourceTotal: 0,
  resourceLoaded: 0,
  resourceProgress: 0
});

function createDemoRspackWorker(): Worker {
  return new Worker(new URL(rspackBrowserWorkerUrl, import.meta.url), {
    type: 'module',
    name: 'react-previewer-demo-rspack-browser'
  });
}

const normalizePath = (value: string) => {
  const path = value.trim();
  return !path ? '/' : path.startsWith('/') ? path : `/${path}`;
};

export default function DemoWorkbench() {
  const [selectedId, setSelectedId] = useState(demoCatalog[0].id);
  const [compilerMode, setCompilerMode] = useState<CompilerMode>('babel');
  const [previewSkin, setPreviewSkin] = useState<PreviewSkin>('paper');
  const [viewportName, setViewportName] = useState<ViewportName>('responsive');
  const [isInspecting, setIsInspecting] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewPath, setPreviewPath] = useState('/');
  const [routeInput, setRouteInput] = useState('/');
  const [status, setStatus] = useState<PreviewStatus>(() => createInitialStatus());

  const selectedDemo = demoCatalog.find((demo) => demo.id === selectedId) ?? demoCatalog[0];
  const viewport = viewports[viewportName];

  const compiler = useMemo<PreviewCompilerLike>(() => {
    if (compilerMode === 'rspack-browser') {
      return {
        type: 'rspack-browser',
        rspack: {
          cdnDomain: 'https://esm.sh',
          workerFactory: createDemoRspackWorker
        }
      };
    }

    return 'babel';
  }, [compilerMode]);

  const classNames = useMemo<ReactPreviewerClassNames>(() => ({
    root: `demo-runtime demo-runtime--${previewSkin}`,
    loading: 'demo-runtime__loading',
    error: 'demo-runtime__error',
    iframe: 'demo-runtime__iframe'
  }), [previewSkin]);

  const styles = useMemo<ReactPreviewerStyles>(() => ({
    root: {
      borderRadius: previewSkin === 'paper' ? 16 : 8,
      boxShadow: previewSkin === 'paper'
        ? '0 28px 80px rgba(29, 38, 56, 0.16)'
        : '0 28px 90px rgba(7, 10, 18, 0.42)'
    },
    loading: {
      backdropFilter: 'blur(14px)'
    },
    error: {
      padding: 28
    },
    iframe: {
      backgroundColor: previewSkin === 'paper' ? '#ffffff' : '#0c1220'
    }
  }), [previewSkin]);

  const selectDemo = (id: string) => {
    setSelectedId(id);
    setSourceInfo(null);
    setPreviewPath('/');
    setRouteInput('/');
    setStatus(createInitialStatus());
  };

  const submitRoute = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const path = normalizePath(routeInput);
    setRouteInput(path);
    setPreviewPath(path);
  };

  const statusLabel = status.error
    ? 'Error'
    : status.phase === 'ready'
      ? 'Ready'
      : status.phase.replace('-', ' ');

  return (
    <div className="demo-app">
      <header className="demo-header">
        <a className="demo-brand" href="#top" aria-label="React Previewer demo 首页">
          <span>RP</span>
          <div><strong>React Previewer</strong><small>Runtime workbench</small></div>
        </a>

        <div className="demo-header__meta">
          <span className="demo-version">v0.0.7</span>
          <a href="https://github.com/ForXd/react-previewer" target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </header>

      <div className="demo-layout" id="top">
        <aside className="demo-sidebar">
          <div>
            <span className="demo-eyebrow">Examples</span>
            <h2>选择预览场景</h2>
          </div>
          <nav className="demo-list" aria-label="预览示例">
            {demoCatalog.map((demo, index) => (
              <button
                type="button"
                className={demo.id === selectedDemo.id ? 'is-active' : undefined}
                onClick={() => selectDemo(demo.id)}
                key={demo.id}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{demo.title}</strong><small>{demo.category}</small></div>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </nav>

          <section className="style-note">
            <span className="demo-eyebrow">Caller-owned UI</span>
            <h3>样式留在调用方</h3>
            <p>设备框、工具栏与视觉主题都属于这个 demo；ReactPreviewer 只负责运行代码。</p>
            <pre>{`classNames={{\n  root: 'demo-runtime',\n  loading: 'custom-loading',\n  iframe: 'custom-frame'\n}}\nstyles={{\n  root: { borderRadius: ${previewSkin === 'paper' ? 16 : 8} }\n}}`}</pre>
          </section>
        </aside>

        <main className="demo-main">
          <section className="demo-hero">
            <div>
              <span className="demo-eyebrow">Deep runtime · small interface</span>
              <h1>预览能力保持纯粹，<br />界面由你来定义。</h1>
              <p>{selectedDemo.description}</p>
            </div>
            <dl>
              <div><dt>Status</dt><dd className={`status-${status.phase}`}>{statusLabel}</dd></div>
              <div><dt>Files</dt><dd>{status.transformedFiles || Object.keys(selectedDemo.files).length}</dd></div>
              <div><dt>Compile</dt><dd>{status.compileDuration === null ? '—' : `${status.compileDuration}ms`}</dd></div>
            </dl>
          </section>

          <section className="workbench" aria-label="React Previewer 工作台">
            <header className="workbench-toolbar">
              <div className="toolbar-group toolbar-group--primary">
                <button
                  type="button"
                  className={isInspecting ? 'is-active' : undefined}
                  onClick={() => {
                    setIsInspecting((value) => !value);
                    setSourceInfo(null);
                  }}
                >
                  <span aria-hidden="true">⌖</span>{isInspecting ? '退出检查' : '检查元素'}
                </button>
                <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>
                  <span aria-hidden="true">↻</span>刷新
                </button>
              </div>

              <div className="toolbar-segment" aria-label="编译器">
                {(['babel', 'rspack-browser'] as const).map((mode) => (
                  <button
                    type="button"
                    className={compilerMode === mode ? 'is-active' : undefined}
                    onClick={() => setCompilerMode(mode)}
                    key={mode}
                  >
                    {mode === 'babel' ? 'Babel' : 'Rspack'}
                  </button>
                ))}
              </div>

              <div className="toolbar-segment" aria-label="预览主题">
                {(['paper', 'ink'] as const).map((skin) => (
                  <button
                    type="button"
                    className={previewSkin === skin ? 'is-active' : undefined}
                    onClick={() => setPreviewSkin(skin)}
                    key={skin}
                  >
                    {skin === 'paper' ? 'Paper' : 'Ink'}
                  </button>
                ))}
              </div>

              <div className="toolbar-segment toolbar-segment--viewport" aria-label="预览宽度">
                {(Object.entries(viewports) as Array<[ViewportName, typeof viewport]>).map(([name, item]) => (
                  <button
                    type="button"
                    className={viewportName === name ? 'is-active' : undefined}
                    onClick={() => setViewportName(name)}
                    key={name}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </header>

            <div className={`preview-stage preview-stage--${previewSkin}`}>
              <div
                className="browser-shell"
                style={{ width: viewport.width, maxWidth: '100%' }}
              >
                <div className="browser-shell__bar">
                  <span className="browser-dots" aria-hidden="true"><i /><i /><i /></span>
                  <form onSubmit={submitRoute}>
                    <span>preview.local</span>
                    <input
                      aria-label="预览路径"
                      value={routeInput}
                      onChange={(event) => setRouteInput(event.target.value)}
                      spellCheck={false}
                    />
                    <button type="submit" aria-label="打开预览路径">→</button>
                  </form>
                  <span className="browser-shell__size">{viewport.label}</span>
                </div>

                <div className="browser-shell__runtime" style={{ height: viewport.height }}>
                  <ReactPreviewer
                    key={`${selectedDemo.id}:${refreshKey}`}
                    files={selectedDemo.files}
                    entryFile={selectedDemo.entryFile}
                    depsInfo={selectedDemo.depsInfo}
                    dependencyStyles={selectedDemo.dependencyStyles}
                    initialPath={previewPath}
                    compiler={compiler}
                    isInspecting={isInspecting}
                    className="demo-runtime-instance"
                    classNames={classNames}
                    styles={styles}
                    style={{ height: '100%', minHeight: '100%' }}
                    iframeTitle={`${selectedDemo.title} preview`}
                    onElementClick={setSourceInfo}
                    onRouteChange={(route) => {
                      setRouteInput(route.href);
                      setPreviewPath(route.href);
                    }}
                    onStatusChange={setStatus}
                  />
                </div>
              </div>
              <InspectorPanel sourceInfo={sourceInfo} onClose={() => setSourceInfo(null)} />
            </div>

            <footer className="workbench-footer">
              <div>
                <span className={`status-dot status-dot--${status.phase}`} />
                <strong>{selectedDemo.title}</strong>
                <span>{compilerMode === 'babel' ? 'Babel compiler' : 'Rspack browser compiler'}</span>
              </div>
              <details>
                <summary>查看入口代码</summary>
                <pre>{selectedDemo.files[selectedDemo.entryFile]}</pre>
              </details>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
