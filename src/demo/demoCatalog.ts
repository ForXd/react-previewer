export interface DemoDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  entryFile: string;
  files: Record<string, string>;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
}

const overviewDemo: DemoDefinition = {
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

const usersDemo: DemoDefinition = {
  id: 'users',
  title: '用户管理',
  category: 'Arco Design',
  description: '第三方组件、包子路径图标与远程样式加载。',
  entryFile: 'App.tsx',
  depsInfo: {
    '@arco-design/web-react': '2.66.1'
  },
  files: {
    'App.tsx': `
import React, { useState } from 'react';
import { Avatar, Button, Card, Input, Space, Table, Tag, Typography } from '@arco-design/web-react';
import { IconPlus, IconSearch } from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import './styles.css';

const initialUsers = [
  { id: 1, name: 'Avery Stone', email: 'avery@studio.dev', role: 'Designer', status: 'Active' },
  { id: 2, name: 'Mika Chen', email: 'mika@studio.dev', role: 'Engineer', status: 'Active' },
  { id: 3, name: 'Jon Bell', email: 'jon@studio.dev', role: 'Researcher', status: 'Invited' }
];

export default function App() {
  const [query, setQuery] = useState('');
  const users = initialUsers.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const columns = [
    {
      title: 'Member',
      render: (_, user) => (
        <Space>
          <Avatar size={34}>{user.name[0]}</Avatar>
          <div className="member"><strong>{user.name}</strong><span>{user.email}</span></div>
        </Space>
      )
    },
    { title: 'Role', dataIndex: 'role' },
    {
      title: 'Status',
      render: (_, user) => <Tag color={user.status === 'Active' ? 'green' : 'arcoblue'}>{user.status}</Tag>
    }
  ];

  return (
    <main className="user-page">
      <header>
        <div><Typography.Title heading={2}>People</Typography.Title><p>Manage access across your workspace.</p></div>
        <Button type="primary" icon={<IconPlus />}>Invite member</Button>
      </header>
      <Card bordered={false} className="user-card">
        <div className="table-tools">
          <Input prefix={<IconSearch />} placeholder="Search members" value={query} onChange={setQuery} allowClear />
          <span>{users.length} members</span>
        </div>
        <Table columns={columns} data={users} rowKey="id" pagination={false} />
      </Card>
    </main>
  );
}
`,
    'styles.css': `
* { box-sizing: border-box; }
body { margin: 0; color: #1d2433; background: #f4f6fa; }
.user-page { min-height: 100vh; padding: clamp(24px, 5vw, 56px); }
.user-page > header { display: flex; align-items: end; justify-content: space-between; gap: 20px; max-width: 1040px; margin: 0 auto 24px; }
.user-page h2 { margin: 0 0 6px !important; letter-spacing: -.035em; }
.user-page p { margin: 0; color: #7a8497; }
.user-card { max-width: 1040px; margin: auto; border-radius: 18px !important; box-shadow: 0 22px 60px rgba(30, 42, 68, .08); }
.table-tools { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.table-tools .arco-input-wrapper { max-width: 320px; border-radius: 9px; }
.table-tools > span { color: #8490a4; font-size: 12px; }
.member { display: grid; gap: 2px; }
.member span { color: #8791a3; font-size: 12px; }
@media (max-width: 620px) { .user-page > header { align-items: flex-start; flex-direction: column; } }
`
  }
};

const routingDemo: DemoDefinition = {
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

const compileErrorDemo: DemoDefinition = {
  id: 'compile-error',
  title: '编译错误',
  category: 'Error · Compile',
  description: '故意保留一个 JSX 闭合错误，展示文件名、错误行列与源码上下文。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React from 'react';

export default function App() {
  const message = 'Fix the highlighted JSX and the preview will recover.';

  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <span>Compile error example</span>
      <h1>One character away.</h1>
      <p>{message}</p>
      <button>Repair preview</button
    </main>
  );
}
`
  }
};

const dependencyErrorDemo: DemoDefinition = {
  id: 'dependency-error',
  title: '依赖错误',
  category: 'Error · Dependency',
  description: '引用一个不存在的 npm 包，展示包名、请求地址与加载失败原因。',
  entryFile: 'App.tsx',
  depsInfo: {
    '@react-previewer/missing-card': '1.0.0'
  },
  files: {
    'App.tsx': `
import React from 'react';
import MissingCard from '@react-previewer/missing-card';

export default function App() {
  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <span>Dependency error example</span>
      <h1>The package request is intentional.</h1>
      <MissingCard />
    </main>
  );
}
`
  }
};

const runtimeErrorDemo: DemoDefinition = {
  id: 'runtime-error',
  title: '运行时错误',
  category: 'Error · Runtime',
  description: '代码可以正常编译，但组件渲染时主动抛错，展示运行时堆栈与源码位置。',
  entryFile: 'App.tsx',
  files: {
    'App.tsx': `
import React from 'react';
import { CrashPanel } from './CrashPanel';

export default function App() {
  return <CrashPanel />;
}
`,
    'CrashPanel.tsx': `
import React from 'react';

export function CrashPanel() {
  const workspace = { name: 'Northstar', owner: null };
  throw new Error('Demo runtime crash: workspace owner is missing');

  return (
    <main style={{ padding: 48, fontFamily: 'system-ui' }}>
      <h1>{workspace.name}</h1>
    </main>
  );
}
`
  }
};

export const demoCatalog = [
  overviewDemo,
  usersDemo,
  routingDemo,
  compileErrorDemo,
  dependencyErrorDemo,
  runtimeErrorDemo
];
