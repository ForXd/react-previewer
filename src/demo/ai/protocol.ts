import { parse } from '@babel/parser';

export type GeneratedFiles = Record<'App.tsx' | 'styles.css', string>;
export const MAX_OUTPUT = 100_000;

export function parseFiles(text: string): GeneratedFiles {
  const clean = text
    .trim()
    .replace(/^```(?:json)?\s*\n?/, '')
    .replace(/\n?```$/, '');
  if (clean.length > MAX_OUTPUT) throw new Error('生成内容超过大小限制');
  const value: unknown = JSON.parse(clean);
  if (!value || typeof value !== 'object' || !('files' in value))
    throw new Error('模型没有返回 files 对象，请重试');
  const files = value.files;
  if (!files || typeof files !== 'object' || Array.isArray(files))
    throw new Error('文件格式无效');
  const entries = Object.entries(files);
  if (
    entries.length !== 2 ||
    entries.some(
      ([name, code]) =>
        !['App.tsx', 'styles.css'].includes(name) || typeof code !== 'string'
    )
  )
    throw new Error('仅支持 App.tsx 和 styles.css 两个文件');
  const result = files as GeneratedFiles;
  if (!result['App.tsx'].trim()) throw new Error('App.tsx 不能为空');
  const ast = parse(result['App.tsx'], {
    sourceType: 'module',
    plugins: ['typescript', 'jsx']
  });
  if (
    !ast.program.body.some((node) => node.type === 'ExportDefaultDeclaration')
  )
    throw new Error('App.tsx 必须默认导出 React 组件');
  function checkImports(value: unknown): void {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(checkImports);
      return;
    }
    const node = value as Record<string, unknown>;
    if (node.type === 'ImportExpression') throw new Error('不支持动态导入');
    if (
      [
        'ImportDeclaration',
        'ExportNamedDeclaration',
        'ExportAllDeclaration'
      ].includes(String(node.type)) &&
      node.source
    ) {
      const source = node.source as { value?: unknown };
      if (!['react', './styles.css'].includes(String(source.value)))
        throw new Error('仅支持导入 react 和 ./styles.css');
    }
    Object.values(node).forEach(checkImports);
  }
  checkImports(ast.program);
  return result;
}

/** Decode SSE events across arbitrary network and UTF-8 boundaries. */
export async function readGeneration(
  stream: ReadableStream<Uint8Array>,
  onText: (text: string) => void
): Promise<GeneratedFiles> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let output = '';
  let stopped = false;
  let finished = false;
  const consume = (event: string) => {
    const data = event
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart())
      .join('\n');
    if (!data) return;
    if (data === '[DONE]') {
      finished = true;
      return;
    }
    const message = JSON.parse(data);
    if (message.error) throw new Error('模型生成失败，请稍后重试');
    const choice = message.choices?.[0];
    if (choice?.finish_reason === 'stop') stopped = true;
    else if (choice?.finish_reason)
      throw new Error('生成被截断或拒绝，请缩短需求后重试');
    const delta = choice?.delta?.content;
    if (typeof delta === 'string') {
      output += delta;
      if (output.length > MAX_OUTPUT) throw new Error('生成内容超过大小限制');
      onText(output);
    }
  };
  try {
    while (!finished) {
      const chunk = await reader.read();
      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      buffer = buffer.replace(/\r\n/g, '\n');
      let boundary: number;
      while ((boundary = buffer.indexOf('\n\n')) >= 0) {
        const event = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        consume(event);
      }
      if (buffer.length > MAX_OUTPUT) throw new Error('流式响应格式无效');
      if (chunk.done) break;
    }
    if (!stopped) throw new Error('连接提前结束，已保留上一版页面');
    return parseFiles(output);
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
