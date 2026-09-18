import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

export async function verifyRelease({ name, version, integrity, commit }, {
  request = fetch, sleep = delay, attempts = 20, interval = 15_000
} = {}) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    let response;
    try {
      response = await request(url, { signal: AbortSignal.timeout(10_000), headers: { 'Cache-Control': 'no-cache' } });
    } catch (error) {
      if (attempt === attempts - 1) throw error;
    }
    if (response?.ok) {
      const published = await response.json();
      assert.equal(published.version, version, 'Registry returned a different version');
      assert.equal(published.dist?.integrity, integrity, 'Published archive differs from the tested archive');
      assert.equal(published.gitHead, commit, 'Published source commit differs from the tested archive');
      console.log(`${name}@${version}: registry archive matches the tested package.`);
      return;
    }
    if (response && ![404, 429].includes(response.status) && response.status < 500) {
      throw new Error(`npm verification failed: HTTP ${response.status}`);
    }
    if (attempt < attempts - 1) await sleep(interval);
  }
  throw new Error('npm package is not visible yet; retry the release workflow to verify it.');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const integrity = `sha512-${createHash('sha512').update(readFileSync(process.argv[2])).digest('base64')}`;
  assert.match(process.env.GITHUB_SHA ?? '', /^[a-f0-9]{40}$/, 'Release verification requires the source commit');
  await verifyRelease({ ...manifest, integrity, commit: process.env.GITHUB_SHA });
}
