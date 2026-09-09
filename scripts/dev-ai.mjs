import { spawn } from 'node:child_process';
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  children.forEach((child) => child.kill('SIGTERM'));
  process.exitCode = code;
}
function run(args, env = {}) {
  const child = spawn(process.execPath, args, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });
  children.push(child);
  child.on('error', () => stop(1));
  child.on('exit', (code) => stop(code ?? 1));
}
const host = 'http://127.0.0.1:5173';
const preview = 'http://127.0.0.1:5174/ai-preview.html';
run(['--env-file-if-exists=.env.ai', 'scripts/ai-server.mjs'], {
  AI_HOST_ORIGIN: host
});
run(
  [
    'node_modules/vite/bin/vite.js',
    '--host',
    '127.0.0.1',
    '--port',
    '5173',
    '--strictPort'
  ],
  {
    VITE_AI_PREVIEW_URL: preview,
    VITE_AI_HOST_ORIGIN: host
  }
);
run(
  [
    'node_modules/vite/bin/vite.js',
    '--host',
    '127.0.0.1',
    '--port',
    '5174',
    '--strictPort'
  ],
  {
    AI_PREVIEW_ONLY: '1',
    VITE_AI_HOST_ORIGIN: host
  }
);
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
console.log(`AI playground: ${host}/#ai`);
