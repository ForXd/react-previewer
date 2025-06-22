// components/DebugPanel.tsx (用于调试)
import React from 'react';
import type { SourceInfo } from '../types';

interface DebugPanelProps {
  sourceInfo: SourceInfo | null;
  isInspecting: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ sourceInfo, isInspecting }) => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs font-mono z-[10001]">
      <div>Inspecting: {isInspecting ? 'YES' : 'NO'}</div>
      <div>SourceInfo: {sourceInfo ? 'YES' : 'NO'}</div>
      {sourceInfo && (
        <div>File: {sourceInfo.file}:{sourceInfo.startLine}</div>
      )}
    </div>
  );
};