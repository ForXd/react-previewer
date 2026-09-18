import type { DemoDefinition } from './types';

export const dependencyErrorDemo: DemoDefinition = {
  group: 'diagnostics',
  id: 'dependency-error',
  title: '依赖错误',
  category: 'Error · Dependency',
  description: '引用一个不存在的 npm 包，展示包名、请求地址与加载失败原因。',
  entryFile: 'App.tsx',
  depsInfo: {
    '@react-previewer/missing-card': '1.0.0'
  },
  files: {
    'App.tsx': `
import React from 'react';
import MissingCard from '@react-previewer/missing-card';

export default function App() {
  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <span>Dependency error example</span>
      <h1>The package request is intentional.</h1>
      <MissingCard />
    </main>
  );
}
`
  }
};
