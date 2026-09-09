import http from 'node:http';
import { pathToFileURL } from 'node:url';

const instructions = `You generate React pages. Return ONLY a JSON object with exactly two files: {"files":{"App.tsx":"...","styles.css":"..."}}. App.tsx must import React from 'react', import './styles.css', and default export a React component. Never call createRoot. Only imports from react and ./styles.css are supported. Use plain CSS, responsive layouts and mock data. No fetch, external scripts, browser storage, parent/top access, secrets, or server code. Return complete replacement files for every request. Do not include markdown or explanations.`;

export function createAiServer({
  apiKey = process.env.AI_API_KEY,
  baseUrl = process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1',
  model = process.env.AI_MODEL || 'openai/gpt-oss-120b',
  allowedOrigin = process.env.AI_HOST_ORIGIN || 'http://127.0.0.1:5173',
  fetchImpl = fetch
} = {}) {
  let active = 0;
  let starts = [];
  return http.createServer(async (req, res) => {
    const json = (status, error) => {
      res.writeHead(status, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({ error }));
    };
    if (req.url !== '/api/generate') return json(404, '接口不存在');
    if (req.method !== 'POST') return json(405, '仅支持 POST');
    if (
      req.headers.origin !== allowedOrigin ||
      !req.headers['content-type']?.startsWith('application/json')
    )
      return json(403, '请求来源不受信任');
    if (!apiKey)
      return json(503, '请在服务端配置 AI_API_KEY 后启动 npm run dev:ai');
    starts = starts.filter((time) => Date.now() - time < 60_000);
    if (active >= 2 || starts.length >= 10) {
      res.setHeader('Retry-After', '60');
      return json(429, '请求过于频繁，请一分钟后重试');
    }
    starts.push(Date.now());
    active++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000);
    res.on('close', () => controller.abort());
    try {
      const chunks = [];
      let bytes = 0;
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > 150_000) {
          json(413, '请求内容过大');
          return;
        }
        chunks.push(chunk);
      }
      let input;
      try {
        input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return json(400, '请求 JSON 无效');
      }
      if (
        !input ||
        typeof input.prompt !== 'string' ||
        !input.prompt.trim() ||
        input.prompt.length > 4000
      )
        return json(400, '请输入 1–4000 字的页面需求');
      const current = input.files;
      if (
        current !== undefined &&
        (!current ||
          typeof current !== 'object' ||
          Array.isArray(current) ||
          Object.keys(current).length !== 2 ||
          Object.entries(current).some(
            ([name, code]) =>
              !['App.tsx', 'styles.css'].includes(name) ||
              typeof code !== 'string'
          ) ||
          JSON.stringify(current).length > 100_000)
      )
        return json(400, '当前页面文件格式无效');
      const upstream = await fetchImpl(
        `${baseUrl.replace(/\/$/, '')}/chat/completions`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            stream: true,
            max_tokens: 8000,
            messages: [
              { role: 'system', content: instructions },
              {
                role: 'user',
                content: `${current ? `Current files:\n${JSON.stringify(current)}\n\n` : ''}${input.prompt}`
              }
            ]
          })
        }
      );
      if (!upstream.ok || !upstream.body) {
        if (upstream.status === 429) {
          res.setHeader(
            'Retry-After',
            upstream.headers.get('retry-after') || '60'
          );
          return json(429, '模型免费额度已耗尽或触发限流，请稍后重试');
        }
        return json(502, '模型服务不可用，请检查服务端模型、Key 和额度配置');
      }
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-Accel-Buffering': 'no'
      });
      let total = 0;
      for await (const chunk of upstream.body) {
        total += chunk.byteLength;
        if (total > 1_000_000) throw new Error('Upstream too large');
        if (!res.write(chunk))
          await new Promise((resolve) => {
            const done = () => {
              res.off('drain', done);
              res.off('close', done);
              resolve();
            };
            res.once('drain', done);
            res.once('close', done);
          });
        if (controller.signal.aborted) break;
      }
      res.end();
    } catch {
      if (!res.headersSent) json(502, '生成超时或连接失败，请重试');
      else res.end();
    } finally {
      clearTimeout(timer);
      controller.abort();
      active--;
    }
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const port = Number(process.env.AI_PORT || 8787);
  createAiServer().listen(port, '127.0.0.1', () =>
    console.log(`AI API listening on 127.0.0.1:${port}`)
  );
}
