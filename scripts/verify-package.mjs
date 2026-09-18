import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { npm, packPackage } from './pack-package.mjs';

const { values } = parseArgs({ options: { tarball: { type: 'string' }, react: { type: 'string', default: '19.2.8' } } });
assert.match(values.react, /^(18|19)\.\d+\.\d+$/);
const tarball = values.tarball ? path.resolve(values.tarball) : packPackage();
const consumer = mkdtempSync(path.join(tmpdir(), 'react-previewer-consumer-'));
const major = values.react.split('.')[0];
const run = (command, args) => execFileSync(command, args, { cwd: consumer, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
try {
  writeFileSync(path.join(consumer, 'package.json'), JSON.stringify({ name: 'package-consumer-test', private: true, type: 'module' }));
  run(npm, ['install', '--registry=https://registry.npmjs.org', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', tarball, `react@${values.react}`, `react-dom@${values.react}`, `@types/react@${major}`, `@types/react-dom@${major}`, 'typescript@7.0.2']);
  const installed = JSON.parse(readFileSync(path.join(consumer, 'node_modules/@zllling/react-previewer/package.json'), 'utf8'));
  assert.equal(installed.version, JSON.parse(readFileSync('package.json', 'utf8')).version);
  assert.match(installed.gitHead ?? '', /^[a-f0-9]{40}$/, 'Archive must retain the source commit');
  writeFileSync(path.join(consumer, 'smoke.mjs'), `
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement, version } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
for (const [format, entry] of Object.entries({ ESM: await import('@zllling/react-previewer'), CommonJS: require('@zllling/react-previewer') })) {
  const markup = renderToStaticMarkup(createElement(entry.ReactPreviewer, {
    files: { 'App.tsx': 'export default () => <main>Preview</main>' },
    iframeTitle: 'Package compatibility check'
  }));
  assert.match(markup, /<iframe/);
  assert.match(markup, /title="Package compatibility check"/);
  console.log(format + ' package export renders with React ' + version);
}
assert.ok(readFileSync(require.resolve('@zllling/react-previewer/styles.css')).length > 0);
const worker = import.meta.resolve('@zllling/react-previewer/rspack-browser-worker');
assert.ok(readFileSync(new URL(worker)).length > 0);
assert.throws(() => require.resolve('@zllling/react-previewer/dist/index.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
`);
  writeFileSync(path.join(consumer, 'consumer.tsx'), `
import { ReactPreviewer, type ReactPreviewerProps, type PreviewStatus, type PreviewCompiler } from '@zllling/react-previewer';
const props: ReactPreviewerProps = {
  files: { 'App.tsx': 'export default () => <main>Preview</main>' },
  onStatusChange: (status: PreviewStatus) => { console.log(status.phase); }
};
export const preview = <ReactPreviewer {...props} />;
export type Compiler = PreviewCompiler;
// @ts-expect-error files is a required public prop
export const invalid = <ReactPreviewer />;
`);
  writeFileSync(path.join(consumer, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
    target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true,
    noEmit: true, skipLibCheck: false, lib: ['ES2022', 'DOM', 'DOM.Iterable']
  }, include: ['consumer.tsx'] }));
  run(process.execPath, ['smoke.mjs']);
  run(npm, ['exec', '--offline', '--', 'tsc', '-p', 'tsconfig.json']);
  console.log(`Public types, CSS and worker exports verified with Node ${process.versions.node} / React ${values.react}.`);
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
