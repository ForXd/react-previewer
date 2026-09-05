import type { DemoDefinition } from './types';

export const routingDemo: DemoDefinition = {
  group: 'examples',
  id: 'routing',
  title: '路由同步',
  category: 'History API',
  description: '由 demo 地址栏驱动路径，并监听 iframe 内部导航。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React, { useEffect, useState } from 'react';
import './styles.css';

const pages = {
  '/': ['Overview', 'A calm home for your preview.'],
  '/activity': ['Activity', 'Follow changes as they happen.'],
  '/settings': ['Settings', 'Tune the workspace to your team.']
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  const navigate = (nextPath) => {
    history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const page = pages[path] || ['Not found', 'Try one of the routes below.'];

  return (
    <main className="route-demo">
      <nav>
        <strong>Northstar</strong>
        <div>{Object.keys(pages).map((item) => <button className={item === path ? 'active' : ''} onClick={() => navigate(item)} key={item}>{item === '/' ? 'Overview' : item.slice(1)}</button>)}</div>
      </nav>
      <section>
        <span>Current path · {path}</span>
        <h1>{page[0]}</h1>
        <p>{page[1]}</p>
      </section>
    </main>
  );
}
`,
    'styles.css': `
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #f4f7ff; background: #0c1220; }
.route-demo { min-height: 100vh; padding: 24px; background: radial-gradient(circle at 65% 20%, #263b75 0, transparent 30%), #0c1220; }
nav { display: flex; align-items: center; justify-content: space-between; max-width: 960px; margin: auto; }
nav strong { letter-spacing: -.03em; }
nav div { display: flex; gap: 6px; }
button { padding: 8px 12px; color: #9ba8c6; background: transparent; border: 0; border-radius: 9px; cursor: pointer; text-transform: capitalize; }
button.active { color: white; background: rgba(255,255,255,.1); }
section { display: grid; min-height: 68vh; max-width: 960px; margin: auto; align-content: center; }
section span { color: #8ca3de; font: 12px ui-monospace, monospace; }
h1 { margin: 14px 0; font-size: clamp(56px, 10vw, 110px); letter-spacing: -.07em; line-height: .9; }
p { margin: 0; color: #aab5ce; font-size: 18px; }
`
  }
};
