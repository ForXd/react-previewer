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
});
