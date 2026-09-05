import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Exercise the published entry points with the installed consumer React.
process.env.NODE_ENV = 'production';
const require = createRequire(import.meta.url);
const { createElement, version } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const entries = {
  ESM: await import('../dist/index.js'),
  CommonJS: require('../dist/index.cjs')
};
for (const [format, { ReactPreviewer }] of Object.entries(entries)) {
  const markup = renderToStaticMarkup(createElement(ReactPreviewer, {
    files: { 'App.tsx': 'export default () => <main>Preview</main>' },
    iframeTitle: 'Package compatibility check'
  }));
  assert.match(markup, /<iframe/);
  assert.match(markup, /title="Package compatibility check"/);
  console.log(`${format} entry renders with React ${version}`);
}
