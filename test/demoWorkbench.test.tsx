/** @vitest-environment jsdom */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@monaco-editor/react', () => ({
  default: ({
    value,
    onChange,
    options
  }: {
    value?: string;
    onChange?: (value?: string) => void;
    options?: { ariaLabel?: string };
  }) => (
    <textarea
      aria-label={options?.ariaLabel ?? '代码编辑器'}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
    />
  ),
  loader: { config: vi.fn() }
}));

vi.mock('monaco-editor/esm/vs/editor/editor.api.js', () => ({}));
vi.mock('monaco-editor/esm/vs/language/css/monaco.contribution.js', () => ({}));
vi.mock(
  'monaco-editor/esm/vs/language/typescript/monaco.contribution.js',
  () => ({})
);

vi.mock('../src/lib/ReactPreview', () => ({
  ReactPreviewer: ({ files }: { files: Record<string, string> }) => (
    <output data-testid="preview-files">{JSON.stringify(files)}</output>
  )
}));

import DemoWorkbench from '../src/demo/DemoWorkbench';

describe('DemoWorkbench live editing', () => {
  afterEach(cleanup);

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('sends Monaco edits from every file to the live preview and can reset them', async () => {
    render(<DemoWorkbench />);

    await screen.findByLabelText('代码编辑器');
    const editedApp =
      'export default function App() { return <main>Edited live</main>; }';
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: editedApp }
    });

    let previewFiles = JSON.parse(
      screen.getByTestId('preview-files').textContent ?? '{}'
    );
    expect(previewFiles['App.tsx']).toBe(editedApp);

    fireEvent.click(screen.getByRole('tab', { name: 'MetricCard.tsx' }));
    const editedCard =
      'export function MetricCard() { return <article>Edited card</article>; }';
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: editedCard }
    });

    previewFiles = JSON.parse(
      screen.getByTestId('preview-files').textContent ?? '{}'
    );
    expect(previewFiles).toMatchObject({
      'App.tsx': editedApp,
      'MetricCard.tsx': editedCard
    });

    fireEvent.click(screen.getByRole('button', { name: '重置代码' }));
    previewFiles = JSON.parse(
      screen.getByTestId('preview-files').textContent ?? '{}'
    );
    expect(previewFiles['App.tsx']).toContain('Good morning, Lin.');
    expect(previewFiles['MetricCard.tsx']).not.toBe(editedCard);
  });

  it('offers editable examples for compile, dependency, and runtime failures', () => {
    render(<DemoWorkbench />);

    expect(screen.getByRole('button', { name: /编译错误/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /依赖错误/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /运行时错误/ })).toBeTruthy();
  });

  it('switches the editor and preview through accessible tabs without a page title', () => {
    render(<DemoWorkbench />);

    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();

    const editorTab = screen.getByRole('tab', { name: '编辑器' });
    const previewTab = screen.getByRole('tab', { name: '预览' });
    const editorPanel = document.getElementById('editor-panel');
    const previewPanel = document.getElementById('preview-panel');

    expect(editorTab.getAttribute('aria-selected')).toBe('true');
    expect(editorPanel?.hidden).toBe(false);
    expect(previewPanel?.hidden).toBe(true);

    fireEvent.click(previewTab);

    expect(previewTab.getAttribute('aria-selected')).toBe('true');
    expect(editorPanel?.hidden).toBe(true);
    expect(previewPanel?.hidden).toBe(false);

    fireEvent.click(editorTab);

    expect(editorTab.getAttribute('aria-selected')).toBe('true');
    expect(editorPanel?.hidden).toBe(false);
    expect(previewPanel?.hidden).toBe(true);
  });
});

describe('DemoWorkbench navigation', () => {
  afterEach(cleanup);

  it('preserves independent drafts when switching examples and only resets the current one', async () => {
    render(<DemoWorkbench />);
    await screen.findByLabelText('代码编辑器');
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: 'overview draft' }
    });
    fireEvent.click(screen.getByRole('button', { name: /路由同步/ }));
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: 'routing draft' }
    });
    fireEvent.click(screen.getByRole('button', { name: /数据概览/ }));
    expect(
      (screen.getByLabelText('代码编辑器') as HTMLTextAreaElement).value
    ).toBe('overview draft');
    fireEvent.click(screen.getByRole('button', { name: '重置代码' }));
    fireEvent.click(screen.getByRole('button', { name: /路由同步/ }));
    expect(
      (screen.getByLabelText('代码编辑器') as HTMLTextAreaElement).value
    ).toBe('routing draft');
  });

  it('filters examples without changing the active document and shows empty results', () => {
    render(<DemoWorkbench />);
    const initialFiles = screen.getByTestId('preview-files').textContent;
    fireEvent.change(screen.getByLabelText('搜索示例'), {
      target: { value: '错误' }
    });
    expect(screen.queryByRole('button', { name: /数据概览/ })).toBeNull();
    expect(screen.getByRole('button', { name: /编译错误/ })).toBeTruthy();
    expect(screen.getByTestId('preview-files').textContent).toBe(initialFiles);
    fireEvent.change(screen.getByLabelText('搜索示例'), {
      target: { value: 'no matching example' }
    });
    expect(screen.getByText('没有匹配的示例，试试其他关键词。')).toBeTruthy();
  });

  it('supports arrow, Home and End keys with roving tab focus', async () => {
    render(<DemoWorkbench />);
    const editorTab = screen.getByRole('tab', { name: '编辑器' });
    fireEvent.keyDown(editorTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: '预览' })).toBe(
      document.activeElement
    );
    expect(editorTab.tabIndex).toBe(-1);
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(editorTab).toBe(document.activeElement);
    await screen.findByLabelText('代码编辑器');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'App.tsx' }), {
      key: 'End'
    });
    expect(screen.getByRole('tab', { name: 'styles.css' })).toBe(
      document.activeElement
    );
    await waitFor(() =>
      expect(
        (screen.getByLabelText('代码编辑器') as HTMLTextAreaElement).value
      ).toContain('.dashboard')
    );
  });

  it('opens the preview for inspection and viewport selection with explicit pressed states', () => {
    render(<DemoWorkbench />);
    fireEvent.click(screen.getByRole('button', { name: '手机' }));
    expect(
      screen.getByRole('tab', { name: '预览' }).getAttribute('aria-selected')
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: '手机' }).getAttribute('aria-pressed')
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '检查元素' }));
    expect(
      screen
        .getByRole('button', { name: '退出检查' })
        .getAttribute('aria-pressed')
    ).toBe('true');
  });
});
