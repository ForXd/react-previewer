import type { DemoDefinition } from './types';

export const overviewDemo: DemoDefinition = {
  group: 'examples',
  id: 'overview',
  title: '数据概览',
  category: 'Local CSS',
  description: '多文件 TSX 与本地 CSS 的轻量产品界面。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React from 'react';
import { MetricCard } from './MetricCard';
import './styles.css';

const activity = [
  { label: 'Design review', owner: 'Maya', time: '12 min' },
  { label: 'Checkout flow', owner: 'Alex', time: '34 min' },
  { label: 'Mobile polish', owner: 'Noah', time: '1 hr' }
];

export default function App() {
  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div>
          <span className="eyebrow">Workspace overview</span>
          <h1>Good morning, Lin.</h1>
          <p>Here is what moved across your projects today.</p>
        </div>
        <button className="primary-action">New project</button>
      </header>

      <section className="metric-grid">
        <MetricCard label="Active projects" value="12" trend="+8%" />
        <MetricCard label="Preview sessions" value="1,284" trend="+24%" />
        <MetricCard label="Build success" value="98.6%" trend="+1.2%" />
      </section>

      <section className="activity-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Live activity</span>
            <h2>Recently updated</h2>
          </div>
          <button className="text-action">View all</button>
        </div>
        <div className="activity-list">
          {activity.map((item) => (
            <article className="activity-row" key={item.label}>
              <span className="avatar">{item.owner[0]}</span>
              <div><strong>{item.label}</strong><span>{item.owner}</span></div>
              <time>{item.time}</time>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
`,
    'MetricCard.tsx': `
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{trend} this month</small>
    </article>
  );
}
`,
    'styles.css': `
:root {
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  color: #192235;
  background: #f3f6fb;
}

* { box-sizing: border-box; }
body { margin: 0; }
button { font: inherit; }

.dashboard {
  min-height: 100vh;
  padding: clamp(24px, 5vw, 64px);
  background:
    radial-gradient(circle at 12% 0%, rgba(116, 138, 255, .16), transparent 28%),
    #f3f6fb;
}

.dashboard__header, .section-heading, .activity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard__header { gap: 24px; margin: 0 auto 36px; max-width: 1080px; }
.eyebrow { color: #718096; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1 { margin: 8px 0; font-size: clamp(34px, 5vw, 56px); letter-spacing: -.055em; line-height: 1; }
h2 { margin: 5px 0 0; font-size: 20px; letter-spacing: -.025em; }
p { margin: 0; color: #657087; }
.primary-action, .text-action { border: 0; cursor: pointer; }
.primary-action { padding: 12px 18px; color: white; background: #1d2638; border-radius: 12px; box-shadow: 0 10px 24px rgba(29, 38, 56, .18); }
.text-action { color: #5268e8; background: transparent; font-weight: 650; }
.metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 1080px; margin: 0 auto 14px; }
.metric-card, .activity-card { background: rgba(255,255,255,.88); border: 1px solid rgba(222,228,239,.9); box-shadow: 0 18px 48px rgba(39,50,75,.06); }
.metric-card { display: grid; gap: 10px; padding: 22px; border-radius: 18px; }
.metric-card > span { color: #727e94; font-size: 13px; }
.metric-card strong { font-size: 32px; letter-spacing: -.045em; }
.metric-card small { color: #17976b; }
.activity-card { max-width: 1080px; margin: auto; padding: 22px; border-radius: 18px; }
.activity-list { margin-top: 18px; border-top: 1px solid #e8ecf3; }
.activity-row { gap: 12px; padding: 15px 0; border-bottom: 1px solid #edf0f5; }
.activity-row:last-child { border-bottom: 0; }
.avatar { display: grid; width: 36px; height: 36px; place-items: center; color: #5268e8; background: #edf0ff; border-radius: 11px; font-weight: 700; }
.activity-row div { display: grid; flex: 1; gap: 3px; }
.activity-row div span, time { color: #7b8597; font-size: 12px; }

@media (max-width: 680px) {
  .dashboard__header { align-items: flex-start; flex-direction: column; }
  .metric-grid { grid-template-columns: 1fr; }
}
`
  }
};
