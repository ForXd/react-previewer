import http from 'node:http';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAiServer } from '../scripts/ai-server.mjs';
const servers = [];
afterEach(async () => {
  for (const server of servers.splice(0)) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
async function start(options = {}) {
  const server = createAiServer({ apiKey: 'test-secret', ...options });
  servers.push(server);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return `http://127.0.0.1:${server.address().port}/api/generate`;
}
function request(
  url,
  body = { prompt: '生成页面' },
  origin = 'http://127.0.0.1:5173'
) {
  return fetch(url, {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}
describe('AI API boundary', () => {
  it('forwards a stream with server-only credentials and bounded context', async () => {
    const upstream = vi.fn(async () => new Response('data: [DONE]\n\n'));
    const url = await start({ fetchImpl: upstream });
    const response = await request(url);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
    expect(await response.text()).toBe('data: [DONE]\n\n');
    const [, init] = upstream.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer test-secret');
    expect(JSON.parse(init.body).messages[1].content).toBe('生成页面');
  });
  it('rejects preview-origin requests and invalid inputs before calling the provider', async () => {
    const upstream = vi.fn();
    const url = await start({ fetchImpl: upstream });
    expect(
      (await request(url, { prompt: 'hi' }, 'http://127.0.0.1:5174')).status
    ).toBe(403);
    expect((await request(url, { prompt: '' })).status).toBe(400);
    expect(
      (await request(url, { prompt: 'hi', files: { '../bad': 'code' } })).status
    ).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('returns actionable quota errors without forwarding provider secrets', async () => {
    const url = await start({
      fetchImpl: async () =>
        new Response('secret-provider-body', {
          status: 429,
          headers: { 'retry-after': '12' }
        })
    });
    const response = await request(url);
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('12');
    expect(await response.text()).not.toContain('secret-provider-body');
  });
  it('aborts upstream generation when the client disconnects', async () => {
    let signal;
    const url = await start({
      fetchImpl: async (_, init) => {
        signal = init.signal;
        return new Response(
          new ReadableStream({
            start(c) {
              c.enqueue(new TextEncoder().encode(': connected\n\n'));
            }
          })
        );
      }
    });
    const response = await request(url);
    await response.body.cancel();
    await vi.waitFor(() => expect(signal.aborted).toBe(true));
  });
});

// An incomplete body must not hold both concurrency slots until Node's default timeout.
it('releases concurrency slots when slow uploads exceed the generation deadline', async () => {
  const url = await start({
    timeoutMs: 100,
    fetchImpl: async () => new Response('data: [DONE]\n\n')
  });
  const upload = () =>
    new Promise((resolve) => {
      const req = http.request(url, {
        method: 'POST',
        headers: {
          origin: 'http://127.0.0.1:5173',
          'content-type': 'application/json'
        }
      });
      req.on('error', () => resolve());
      req.on('close', () => resolve());
      req.write('{"prompt":');
    });
  await Promise.all([upload(), upload()]);
  expect((await request(url)).status).toBe(200);
});
