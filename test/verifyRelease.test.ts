import { describe, expect, it, vi } from 'vitest';
import { verifyRelease } from '../scripts/verify-release.mjs';

const release = { name: '@zllling/react-previewer', version: '0.1.0', integrity: 'sha512-tested', commit: 'a'.repeat(40) };
const published = () => Response.json({ version: release.version, dist: { integrity: release.integrity }, gitHead: release.commit });

describe('published package verification', () => {
  it('waits for propagation and registry recovery before confirming the archive', async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockRejectedValueOnce(new Error('network unavailable'))
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(published());
    const sleep = vi.fn();
    await verifyRelease(release, { request, sleep });
    expect(request).toHaveBeenCalledTimes(4);
    expect(sleep).toHaveBeenCalledTimes(3);
  });

  it('rejects a version whose tarball does not match the tested artifact', async () => {
    const request = vi.fn().mockResolvedValue(Response.json({ version: release.version, dist: { integrity: 'sha512-different' } }));
    await expect(verifyRelease(release, { request })).rejects.toThrow('differs from the tested archive');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('stops after bounded retries instead of reporting an invisible release as complete', async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    const sleep = vi.fn();
    await expect(verifyRelease(release, { request, sleep, attempts: 2 })).rejects.toThrow('not visible yet');
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it('rejects source metadata pointing at a different commit', async () => {
    const request = vi.fn().mockResolvedValue(Response.json({ version: release.version, dist: { integrity: release.integrity }, gitHead: 'b'.repeat(40) }));
    await expect(verifyRelease(release, { request })).rejects.toThrow('source commit differs');
  });

  it('does not retry a permission failure', async () => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 403 }));
    await expect(verifyRelease(release, { request })).rejects.toThrow('HTTP 403');
    expect(request).toHaveBeenCalledTimes(1);
  });
});
