import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

export function packPackage(destination = '.artifacts') {
  destination = path.resolve(destination);
  mkdirSync(destination, { recursive: true });
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  // npm publish <tarball> does not infer gitHead as directory publishing does.
  // Include it before tests so recovery can target the original source commit.
  const gitHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const staging = mkdtempSync(path.join(tmpdir(), 'react-previewer-pack-'));
  let archive;
  try {
    for (const file of ['dist', 'README.md', 'LICENSE']) cpSync(file, path.join(staging, file), { recursive: true });
    writeFileSync(path.join(staging, 'package.json'), JSON.stringify({ ...manifest, gitHead }, null, 2) + '\n');
    // Build before this command. CI publishes this exact, tested archive.
    [archive] = JSON.parse(execFileSync(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', destination], { cwd: staging, encoding: 'utf8' }));
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  assert.equal(archive.name, manifest.name);
  assert.equal(archive.version, manifest.version);
  const files = new Set(archive.files.map(file => file.path));
  for (const required of ['package.json', 'README.md', 'LICENSE', manifest.main, manifest.module, manifest.types, manifest.style, 'dist/rspack-browser-worker.js']) {
    assert.ok(files.has(required), `Package is missing ${required}`);
  }
  for (const file of files) {
    assert.ok(file.startsWith('dist/') || ['package.json', 'README.md', 'LICENSE'].includes(file), `Unexpected package file: ${file}`);
  }
  const tarball = path.resolve(destination, archive.filename);
  console.log(`Verified archive: ${archive.name}@${archive.version}, ${files.size} files`);
  return tarball;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) packPackage();
