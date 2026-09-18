/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
vi.mock('monaco-editor/esm/vs/language/typescript/monaco.contribution.js', () => ({}));

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

  it('sends Monaco edits from every file to the live preview and can reset them', () => {
    render(<DemoWorkbench />);

    const editedApp = 'export default function App() { return <main>Edited live</main>; }';
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: editedApp }
    });

    let previewFiles = JSON.parse(screen.getByTestId('preview-files').textContent ?? '{}');
    expect(previewFiles['App.tsx']).toBe(editedApp);

    fireEvent.click(screen.getByRole('button', { name: /数据概览/ }));
    expect(JSON.parse(screen.getByTestId('preview-files').textContent ?? '{}')['App.tsx']).toBe(editedApp);

    fireEvent.click(screen.getByRole('tab', { name: 'MetricCard.tsx' }));
    const editedCard = 'export function MetricCard() { return <article>Edited card</article>; }';
    fireEvent.change(screen.getByLabelText('代码编辑器'), {
      target: { value: editedCard }
    });

    previewFiles = JSON.parse(screen.getByTestId('preview-files').textContent ?? '{}');
    expect(previewFiles).toMatchObject({
      'App.tsx': editedApp,
      'MetricCard.tsx': editedCard
    });

    fireEvent.click(screen.getByRole('button', { name: '重置代码' }));
    previewFiles = JSON.parse(screen.getByTestId('preview-files').textContent ?? '{}');
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

  it('supports keyboard navigation across view and file tabs', () => {
    render(<DemoWorkbench />);
    const editorTab = screen.getByRole('tab', { name: '编辑器' });
    const previewTab = screen.getByRole('tab', { name: '预览' });
    fireEvent.keyDown(editorTab, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(previewTab);
    expect(previewTab.getAttribute('aria-selected')).toBe('true');
    expect(editorTab.tabIndex).toBe(-1);
    fireEvent.keyDown(previewTab, { key: 'Home' });
    expect(document.activeElement).toBe(editorTab);

    const appTab = screen.getByRole('tab', { name: 'App.tsx' });
    fireEvent.keyDown(appTab, { key: 'ArrowRight' });
    const cardTab = screen.getByRole('tab', { name: 'MetricCard.tsx' });
    expect(document.activeElement).toBe(cardTab);
    expect(cardTab.getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('code-editor-panel')?.getAttribute('aria-labelledby')).toBe(cardTab.id);
    fireEvent.keyDown(cardTab, { key: 'End' });
    const fileTabs = document.querySelectorAll('.code-file-tabs [role="tab"]');
    expect(document.activeElement).toBe(fileTabs[fileTabs.length - 1]);
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(appTab);
  });

  it('opens the preview when element inspection is enabled', () => {
    render(<DemoWorkbench />);
    const inspectButton = screen.getByRole('button', { name: '检查元素' });
    fireEvent.click(inspectButton);
    expect(inspectButton.getAttribute('aria-pressed')).toBe('true');
    expect(document.getElementById('preview-panel')?.hidden).toBe(false);
    expect(screen.getByRole('tab', { name: '预览' }).getAttribute('aria-selected')).toBe('true');
  });
});
