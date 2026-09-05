import type { ReactNode } from 'react';
import type {
  CompilerMode,
  PreviewSkin,
  ViewportName
} from '../workbenchConfig';
import { Icon } from './Icon';

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="toolbar-segment" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-label={option.label}
          aria-pressed={value === option.value}
          className={value === option.value ? 'is-active' : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

interface WorkbenchToolbarProps {
  isInspecting: boolean;
  isDirty: boolean;
  compiler: CompilerMode;
  skin: PreviewSkin;
  viewport: ViewportName;
  onInspect: () => void;
  onRefresh: () => void;
  onReset: () => void;
  onCompiler: (value: CompilerMode) => void;
  onSkin: (value: PreviewSkin) => void;
  onViewport: (value: ViewportName) => void;
}

export function WorkbenchToolbar(props: WorkbenchToolbarProps) {
  return (
    <header className="workbench-toolbar">
      <div className="toolbar-actions">
        <button
          type="button"
          aria-pressed={props.isInspecting}
          className={props.isInspecting ? 'is-active' : undefined}
          onClick={props.onInspect}
        >
          <Icon name="inspect" />
          {props.isInspecting ? '退出检查' : '检查元素'}
        </button>
        <button
          type="button"
          onClick={props.onRefresh}
          aria-label="刷新预览"
          title="刷新预览"
        >
          <Icon name="refresh" />
        </button>
        <button
          type="button"
          onClick={props.onReset}
          disabled={!props.isDirty}
          aria-label="重置代码"
          title="重置当前示例"
        >
          <Icon name="reset" />
        </button>
      </div>
      <ChoiceGroup
        label="编译器"
        value={props.compiler}
        onChange={props.onCompiler}
        options={[
          { value: 'babel', label: 'Babel' },
          { value: 'rspack-browser', label: 'Rspack' }
        ]}
      />
      <div className="toolbar-display">
        <ChoiceGroup
          label="预览宽度"
          value={props.viewport}
          onChange={props.onViewport}
          options={[
            {
              value: 'responsive',
              label: '响应式',
              icon: <Icon name="desktop" />
            },
            { value: 'tablet', label: '平板', icon: <Icon name="tablet" /> },
            { value: 'mobile', label: '手机', icon: <Icon name="mobile" /> }
          ]}
        />
        <ChoiceGroup
          label="预览主题"
          value={props.skin}
          onChange={props.onSkin}
          options={[
            { value: 'paper', label: 'Paper', icon: <Icon name="sun" /> },
            { value: 'ink', label: 'Ink', icon: <Icon name="moon" /> }
          ]}
        />
      </div>
    </header>
  );
}
