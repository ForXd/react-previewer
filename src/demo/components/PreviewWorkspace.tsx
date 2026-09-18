import {
  ReactPreviewer,
  type ReactPreviewerProps,
  type SourceInfo
} from '../../lib/ReactPreview';
import { InspectorPanel } from '../InspectorPanel';
import {
  viewports,
  type PreviewSkin,
  type ViewportName
} from '../workbenchConfig';
import { Icon } from './Icon';

interface PreviewWorkspaceProps {
  previewProps: ReactPreviewerProps;
  runtimeKey: string;
  skin: PreviewSkin;
  viewport: ViewportName;
  routeInput: string;
  onRouteInput: (value: string) => void;
  onNavigate: (value: string) => void;
  sourceInfo: SourceInfo | null;
  onCloseInspector: () => void;
  onOpenSource: () => void;
}

export function PreviewWorkspace(props: PreviewWorkspaceProps) {
  const viewport = viewports[props.viewport];
  return (
    <div className={`preview-stage preview-stage--${props.skin}`}>
      <div
        className="browser-shell"
        style={{ width: viewport.width, maxWidth: '100%' }}
      >
        <div className="browser-shell__bar">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              props.onNavigate(props.routeInput);
            }}
          >
            <span>preview.local</span>
            <input
              aria-label="预览路径"
              value={props.routeInput}
              onChange={(event) => props.onRouteInput(event.target.value)}
              spellCheck={false}
            />
            <button type="submit" aria-label="打开预览路径">
              <Icon name="arrow" />
            </button>
          </form>
          <span className="browser-shell__size">
            {typeof viewport.width === 'number'
              ? `${viewport.width}px`
              : 'Auto'}
          </span>
        </div>
        <div className="browser-shell__runtime">
          <ReactPreviewer
            {...props.previewProps}
            key={props.runtimeKey}
            classNames={{
              root: `demo-runtime demo-runtime--${props.skin}`,
              loading: 'demo-runtime__loading',
              error: 'demo-runtime__error',
              iframe: 'demo-runtime__iframe'
            }}
          />
        </div>
      </div>
      <InspectorPanel
        sourceInfo={props.sourceInfo}
        onClose={props.onCloseInspector}
        onOpenSource={props.onOpenSource}
      />
    </div>
  );
}
