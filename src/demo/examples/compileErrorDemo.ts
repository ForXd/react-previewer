import type { DemoDefinition } from './types';

export const compileErrorDemo: DemoDefinition = {
  group: 'diagnostics',
  id: 'compile-error',
  title: '编译错误',
  category: 'Error · Compile',
  description: '故意保留一个 JSX 闭合错误，展示文件名、错误行列与源码上下文。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React from 'react';

export default function App() {
  const message = 'Fix the highlighted JSX and the preview will recover.';

  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <span>Compile error example</span>
      <h1>One character away.</h1>
      <p>{message}</p>
      <button>Repair preview</button
    </main>
  );
}
`
  }
};
