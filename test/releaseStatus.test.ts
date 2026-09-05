import { describe, expect, it, vi } from 'vitest';
import { getReleaseStatus } from '../scripts/release-status.mjs';

const release = { name: '@zllling/react-previewer', version: '0.1.0', refType: 'branch', refName: 'main' };

describe('automatic npm release eligibility', () => {
  it('publishes a main version only when npm confirms it is absent', async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    expect(await getReleaseStatus(release, request)).toEqual({ published: false, version: '0.1.0', tag: 'v0.1.0' });
    expect(request).toHaveBeenCalledWith('https://registry.npmjs.org/%40zllling%2Freact-previewer/0.1.0');
  });

  it('skips an already published version after another main merge', async () => {
    const request = vi.fn().mockResolvedValue(Response.json({ version: '0.1.0' }));
    expect((await getReleaseStatus(release, request)).published).toBe(true);
  });

  it('does not interpret registry outages as permission to publish', async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    await expect(getReleaseStatus(release, request)).rejects.toThrow('HTTP 503');
  });

  it.each([
    { refType: 'branch', refName: 'feature' },
    { refType: 'tag', refName: 'v0.0.7' },
    { version: '0.1.0-beta.1' }
  ])('rejects an invalid release context %j before querying npm', async (overrides) => {
    const request = vi.fn();
    await expect(getReleaseStatus({ ...release, ...overrides }, request)).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  });

  it('also supports an explicitly pushed matching tag', async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    expect((await getReleaseStatus({ ...release, refType: 'tag', refName: 'v0.1.0' }, request)).published).toBe(false);
  });
});
