import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function getReleaseStatus({ name, version, refType, refName }, request = fetch) {
  assert.match(version, /^\d+\.\d+\.\d+$/, 'Only stable versions can be published');
  const tag = `v${version}`;
  if (refType === 'tag') {
    assert.equal(refName, tag, 'Tag must match package.json');
  } else {
    assert.equal(refType, 'branch', 'Publishing requires main or a version tag');
    assert.equal(refName, 'main', 'Only main can publish without a version tag');
  }
  const response = await request(`https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`);
  if (response.status === 404) return { published: false, version, tag };
  if (!response.ok) throw new Error(`npm version lookup failed: HTTP ${response.status}`);
  assert.equal((await response.json()).version, version, 'npm returned an unexpected version');
  return { published: true, version, tag };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { name, version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const release = await getReleaseStatus({
    name,
    version,
    refType: process.env.GITHUB_REF_TYPE,
    refName: process.env.GITHUB_REF_NAME
  });
  console.log(`${name}@${version}: ${release.published ? 'already published; skipping npm publish' : 'ready to publish'}`);
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `published=${release.published}\ntag=${release.tag}\n`);
  }
}
