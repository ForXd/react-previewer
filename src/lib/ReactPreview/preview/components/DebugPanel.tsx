// components/DebugPanel.tsx (用于调试)
import React from 'react';

interface DebugPanelProps {
  sourceInfo: any;
  isInspecting: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ sourceInfo, isInspecting }) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs font-mono z-[10001]">
      <div>Inspecting: {isInspecting ? 'YES' : 'NO'}</div>
      <div>SourceInfo: {sourceInfo ? 'YES' : 'NO'}</div>
      {sourceInfo && (
        <div>File: {sourceInfo.file}:{sourceInfo.line}</div>
      )}
    </div>
  );
};