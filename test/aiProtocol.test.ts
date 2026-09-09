import { describe, expect, it } from 'vitest';
import { parseFiles, readGeneration } from '../src/demo/ai/protocol';
const files = {
  'App.tsx': 'export default function App(){return <h1>你好</h1>}',
  'styles.css': ''
};
const event = (data: unknown) => `data: ${JSON.stringify(data)}\r\n\r\n`;
function stream(text: string, oneByte = false) {
  const bytes = new TextEncoder().encode(text);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      if (oneByte)
        for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
      else controller.enqueue(bytes);
      controller.close();
    }
  });
}
describe('AI generation protocol', () => {
  it('reassembles split CRLF events and multibyte Chinese output', async () => {
    const output = JSON.stringify({ files });
    const sse =
      ': heartbeat\r\n\r\n' +
      event({ choices: [{ delta: { content: output.slice(0, 40) } }] }) +
      event({
        choices: [
          { delta: { content: output.slice(40) }, finish_reason: 'stop' }
        ]
      }) +
      'data: [DONE]\r\n\r\n';
    const updates: string[] = [];
    expect(
      await readGeneration(stream(sse, true), (value) => updates.push(value))
    ).toEqual(files);
    expect(updates.at(-1)).toBe(output);
  });
  it('rejects truncated output even if its JSON happened to be valid', async () => {
    await expect(
      readGeneration(
        stream(
          event({
            choices: [{ delta: { content: JSON.stringify({ files }) } }]
          })
        ),
        () => {}
      )
    ).rejects.toThrow('提前结束');
    await expect(
      readGeneration(
        stream(event({ choices: [{ finish_reason: 'length' }] })),
        () => {}
      )
    ).rejects.toThrow('截断');
  });
  it('rejects unexpected files and oversized responses', () => {
    expect(() =>
      parseFiles(JSON.stringify({ files: { ...files, '../secret': '' } }))
    ).toThrow('仅支持');
    expect(() => parseFiles('x'.repeat(100001))).toThrow('大小');
    expect(() => parseFiles('{"files":null}')).toThrow('格式');
    expect(
      parseFiles('```json\n' + JSON.stringify({ files }) + '\n```')
    ).toEqual(files);
  });
});
