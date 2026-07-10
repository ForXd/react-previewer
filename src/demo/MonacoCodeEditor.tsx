import { useEffect, useRef } from 'react';
import Editor, { loader, type Monaco, type OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/language/css/monaco.contribution.js';
import * as typescript from 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import type { ErrorInfo } from '../lib/ReactPreview';

type MonacoEditor = Parameters<OnMount>[0];

interface TypeScriptDefaults {
  setCompilerOptions: (options: Record<string, unknown>) => void;
  setDiagnosticsOptions: (options: Record<string, unknown>) => void;
}

interface TypeScriptLanguageApi {
  JsxEmit: { ReactJSX: number };
  ModuleResolutionKind: { NodeJs: number };
  ScriptTarget: { ES2022: number };
  typescriptDefaults: TypeScriptDefaults;
  javascriptDefaults: TypeScriptDefaults;
}

const typescriptApi = typescript as unknown as TypeScriptLanguageApi;

const workerScope = self as typeof self & {
  MonacoEnvironment?: {
    getWorker: (_moduleId: string, label: string) => Worker;
  };
};

workerScope.MonacoEnvironment = {
  getWorker: (_moduleId, label) => {
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
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
  demoId: string;
  fileName: string;
  value: string;
  error: ErrorInfo | null;
  onChange: (value: string) => void;
}

export function MonacoCodeEditor({
  demoId,
  fileName,
  value,
  error,
  onChange
}: MonacoCodeEditorProps) {
  const editorRef = useRef<MonacoEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleMount: OnMount = (editor, monacoApi) => {
    editorRef.current = editor;
    monacoRef.current = monacoApi;
  };

  useEffect(() => {
    const editor = editorRef.current;
    const monacoApi = monacoRef.current;
    const model = editor?.getModel();
    if (!editor || !monacoApi || !model) return;

    monacoApi.editor.setModelMarkers(model, 'react-previewer', []);
    if (!error || error.fileName !== fileName || error.lineNumber === undefined) return;

    const lineNumber = Math.min(Math.max(1, error.lineNumber), model.getLineCount());
    const maxColumn = model.getLineMaxColumn(lineNumber);
    const columnNumber = Math.min(Math.max(1, error.columnNumber ?? 1), maxColumn);
    monacoApi.editor.setModelMarkers(model, 'react-previewer', [{
      severity: monacoApi.MarkerSeverity.Error,
      message: error.message,
      startLineNumber: lineNumber,
      startColumn: columnNumber,
      endLineNumber: lineNumber,
      endColumn: Math.min(columnNumber + 1, maxColumn)
    }]);
    editor.revealPositionInCenter({ lineNumber, column: columnNumber });
  }, [error, fileName]);

  return (
    <Editor
      path={`/${demoId}/${fileName}`}
      language={getLanguage(fileName)}
      value={value}
      theme="vs-dark"
      onMount={handleMount}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      beforeMount={() => {
        const compilerOptions = {
          allowNonTsExtensions: true,
          allowJs: true,
          jsx: typescriptApi.JsxEmit.ReactJSX,
          moduleResolution: typescriptApi.ModuleResolutionKind.NodeJs,
          target: typescriptApi.ScriptTarget.ES2022
        };
        typescriptApi.typescriptDefaults.setCompilerOptions(compilerOptions);
        typescriptApi.javascriptDefaults.setCompilerOptions(compilerOptions);
        typescriptApi.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSuggestionDiagnostics: true
        });
        typescriptApi.javascriptDefaults.setDiagnosticsOptions({
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
        fontSize: 12,
        lineHeight: 20,
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
