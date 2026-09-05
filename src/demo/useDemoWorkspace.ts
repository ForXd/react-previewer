import { useReducer, useState } from 'react';
import type { PreviewStatus, SourceInfo } from '../lib/ReactPreview';
import { demoCatalog } from './demoCatalog';

type Draft = { files: Record<string, string>; activeFile: string };
type Workspace = { selectedId: string; drafts: Record<string, Draft> };
type Action =
  | { type: 'select'; id: string }
  | { type: 'edit'; value: string }
  | { type: 'open'; file: string }
  | { type: 'reset' };

function createDraft(id: string): Draft {
  const demo = demoCatalog.find((item) => item.id === id)!;
  return { files: { ...demo.files }, activeFile: demo.entryFile };
}

function reducer(state: Workspace, action: Action): Workspace {
  if (action.type === 'select') {
    if (!demoCatalog.some((demo) => demo.id === action.id)) return state;
    return {
      selectedId: action.id,
      drafts: {
        ...state.drafts,
        [action.id]: state.drafts[action.id] ?? createDraft(action.id)
      }
    };
  }
  const current = state.drafts[state.selectedId];
  let next = current;
  if (action.type === 'reset') next = createDraft(state.selectedId);
  if (action.type === 'open' && action.file in current.files)
    next = { ...current, activeFile: action.file };
  if (action.type === 'edit')
    next = {
      ...current,
      files: { ...current.files, [current.activeFile]: action.value }
    };
  return { ...state, drafts: { ...state.drafts, [state.selectedId]: next } };
}

/** Owns example drafts and the editing session; presentation stays in views. */
export function useDemoWorkspace() {
  const [workspace, dispatch] = useReducer(reducer, undefined, () => ({
    selectedId: demoCatalog[0].id,
    drafts: { [demoCatalog[0].id]: createDraft(demoCatalog[0].id) }
  }));
  const [status, setStatus] = useState<PreviewStatus | null>(null);
  const [sourceInfo, setSourceInfo] = useState<SourceInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [path, setPath] = useState('/');
  const [routeInput, setRouteInput] = useState('/');
  const demo = demoCatalog.find((item) => item.id === workspace.selectedId)!;
  const draft = workspace.drafts[demo.id];
  const isDirty = Object.keys(draft.files).some(
    (file) => draft.files[file] !== demo.files[file]
  );

  const selectDemo = (id: string) => {
    if (id === demo.id) return;
    dispatch({ type: 'select', id });
    setPath('/');
    setRouteInput('/');
    setSourceInfo(null);
    setStatus(null);
  };
  const refresh = () => {
    setRefreshKey((key) => key + 1);
    setStatus(null);
    setSourceInfo(null);
  };
  const updateFile = (value: string) => {
    if (value === draft.files[draft.activeFile]) return;
    dispatch({ type: 'edit', value });
    setSourceInfo(null);
    setStatus(null);
  };
  const reset = () => {
    dispatch({ type: 'reset' });
    refresh();
  };
  const navigate = (value: string) => {
    let next = '/';
    try {
      const url = new URL(value.trim() || '/', 'https://preview.local');
      next = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      /* Invalid paths return to the example root. */
    }
    setPath(next);
    setRouteInput(next);
  };
  const receiveStatus = (next: PreviewStatus) => {
    setStatus(next);
    if (next.error?.fileName)
      dispatch({ type: 'open', file: next.error.fileName });
  };

  return {
    demo,
    ...draft,
    isDirty,
    status,
    sourceInfo,
    setSourceInfo,
    runtimeKey: `${demo.id}:${refreshKey}`,
    path,
    routeInput,
    setRouteInput,
    navigate,
    selectDemo,
    updateFile,
    reset,
    refresh,
    receiveStatus,
    openFile: (file: string) => dispatch({ type: 'open', file })
  };
}
