import type { DemoDefinition } from './types';

export const runtimeErrorDemo: DemoDefinition = {
  group: 'diagnostics',
  id: 'runtime-error',
  title: '运行时错误',
  category: 'Error · Runtime',
  description:
    '代码可以正常编译，但组件渲染时主动抛错，展示运行时堆栈与源码位置。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React from 'react';
import { CrashPanel } from './CrashPanel';

export default function App() {
  return <CrashPanel />;
}
`,
    'CrashPanel.tsx': `
import React from 'react';

export function CrashPanel() {
  const workspace = { name: 'Northstar', owner: null };
  throw new Error('Demo runtime crash: workspace owner is missing');

  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <h1>{workspace.name}</h1>
    </main>
  );
}
`
  }
};
