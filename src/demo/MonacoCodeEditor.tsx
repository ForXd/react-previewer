import { useEffect, useRef, useState } from 'react';
import Editor, {
  loader,
  type Monaco,
  type OnMount
} from '@monaco-editor/react';
import * as monaco from 'monaco-editor/editor/editor.api.js';
import 'monaco-editor/languages/definitions/css/register.js';
import 'monaco-editor/languages/definitions/javascript/register.js';
import 'monaco-editor/languages/definitions/typescript/register.js';
import 'monaco-editor/languages/features/css/register.js';
import * as typescript from 'monaco-editor/languages/features/typescript/register.js';
import editorWorker from 'monaco-editor/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/languages/features/css/css.worker?worker';
import tsWorker from 'monaco-editor/languages/features/typescript/ts.worker?worker';
import type { ErrorInfo, SourceInfo } from '../lib/ReactPreview';

type MonacoEditor = Parameters<OnMount>[0];

const workerScope = self as typeof self & {
  MonacoEnvironment?: {
    getWorker: (_moduleId: string, label: string) => Worker;
  };
};

workerScope.MonacoEnvironment = {
  getWorker: (_moduleId, label) => {
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    if (label === 'css' || label === 'scss' || label === 'less')
      return new cssWorker();
    return new editorWorker();
  }
};

loader.config({ monaco: monaco as unknown as Monaco });

const languageByExtension: Record<string, string> = {
  css: 'css',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  ts: 'typescript',
  tsx: 'typescript'
};

const getLanguage = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return languageByExtension[extension] ?? 'plaintext';
};

interface MonacoCodeEditorProps {
  theme: 'vs' | 'vs-dark';
  sourceInfo: SourceInfo | null;
  demoId: string;
  fileName: string;
  value: string;
  error: ErrorInfo | null;
  onChange: (value: string) => void;
}

export function MonacoCodeEditor({
  theme,
  sourceInfo,
  demoId,
  fileName,
  value,
  error,
  onChange
}: MonacoCodeEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<MonacoEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleMount: OnMount = (editor, monacoApi) => {
    editorRef.current = editor;
    monacoRef.current = monacoApi;
    setIsMounted(true);
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monacoApi = monacoRef.current;
    const model = editor?.getModel();
    if (!editor || !monacoApi || !model) return;

    monacoApi.editor.setModelMarkers(model, 'react-previewer', []);
    if (!error || error.fileName !== fileName || error.lineNumber === undefined)
      return;

    const lineNumber = Math.min(
      Math.max(1, error.lineNumber),
      model.getLineCount()
    );
    const maxColumn = model.getLineMaxColumn(lineNumber);
    const columnNumber = Math.min(
      Math.max(1, error.columnNumber ?? 1),
      maxColumn
    );
    monacoApi.editor.setModelMarkers(model, 'react-previewer', [
      {
        severity: monacoApi.MarkerSeverity.Error,
        message: error.message,
        startLineNumber: lineNumber,
        startColumn: columnNumber,
        endLineNumber: lineNumber,
        endColumn: Math.min(columnNumber + 1, maxColumn)
      }
    ]);
    editor.revealPositionInCenter({ lineNumber, column: columnNumber });
  }, [error, fileName, demoId, isMounted]);

  useEffect(() => {
    if (!isMounted || !sourceInfo || sourceInfo.file !== fileName) return;
    editorRef.current?.setSelection({
      startLineNumber: sourceInfo.startLine,
      startColumn: sourceInfo.startColumn,
      endLineNumber: sourceInfo.endLine,
      endColumn: sourceInfo.endColumn
    });
    editorRef.current?.revealLineInCenter(sourceInfo.startLine);
    editorRef.current?.focus();
  }, [sourceInfo, fileName, isMounted]);

  return (
    <Editor
      height="var(--demo-editor-height)"
      path={`/${demoId}/${fileName}`}
      language={getLanguage(fileName)}
      value={value}
      theme={theme}
      onMount={handleMount}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      beforeMount={() => {
        const compilerOptions = {
          allowNonTsExtensions: true,
          allowJs: true,
          jsx: typescript.JsxEmit.ReactJSX,
          moduleResolution: typescript.ModuleResolutionKind.NodeJs,
          target: typescript.ScriptTarget.ES2020
        };
        typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
        typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
        typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSuggestionDiagnostics: true
        });
        typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSuggestionDiagnostics: true
        });
      }}
      options={{
        ariaLabel: '代码编辑器',
        automaticLayout: true,
        bracketPairColorization: { enabled: true },
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
        fontLigatures: true,
        fontSize: 13,
        lineHeight: 22,
        lineNumbersMinChars: 3,
        minimap: { enabled: false },
        padding: { top: 14, bottom: 14 },
        renderLineHighlight: 'gutter',
        renderWhitespace: 'selection',
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        tabSize: 2,
        wordWrap: 'on'
      }}
      loading={<div className="code-editor-loading">正在载入 Monaco…</div>}
    />
  );
}
