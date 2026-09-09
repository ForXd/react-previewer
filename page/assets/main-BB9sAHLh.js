const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./MonacoCodeEditor-CSu0Iydq.js","./rolldown-runtime-Dd_uD5pT.js","./jsx-runtime-o-ODfca4.js","./preload-helper-HclGiUj8.js","./editor.api-DFSOOEQI.js","./editor-jjEx9u7D.css","./register-CWlLIDBv.js","./AiWorkbench-BC0HhAFm.js","./protocol-D5bmE1-s.js","./lib-BdTFlsRs.js","./AiWorkbench-BB-ZK1Fc.css"])))=>i.map(i=>d[i]);
import{i as e}from"./rolldown-runtime-Dd_uD5pT.js";import{n as t,t as n}from"./ReactPreview-CKeiyGI_.js";import{n as r,t as i}from"./jsx-runtime-o-ODfca4.js";import{t as a}from"./preload-helper-HclGiUj8.js";var o=e(r(),1),s=t(),c=`0.1.0`,l=[{group:`examples`,id:`overview`,title:`数据概览`,category:`Local CSS`,description:`多文件 TSX 与本地 CSS 的轻量产品界面。`,entryFile:`App.tsx`,files:{"App.tsx":`
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
`,"MetricCard.tsx":`
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
`,"styles.css":`
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
`}},{group:`examples`,id:`users`,title:`用户管理`,category:`Arco Design`,description:`第三方组件、包子路径图标与远程样式加载。`,entryFile:`App.tsx`,depsInfo:{"@arco-design/web-react":`2.66.16`},files:{"App.tsx":`
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
        <Table columns={columns} data={users} rowKey="id" pagination={false} scroll={{ x: 560 }} />
      </Card>
    </main>
  );
}
`,"styles.css":`
* { box-sizing: border-box; }
body { margin: 0; color: #1d2433; background: #f4f6fa; }
.user-page { min-height: 100vh; padding: clamp(24px, 5vw, 56px); }
.user-page > header { display: flex; align-items: end; justify-content: space-between; gap: 20px; max-width: 1040px; margin: 0 auto 24px; }
.user-page h2 { margin: 0 0 6px !important; letter-spacing: -.035em; }
.user-page p { margin: 0; color: #7a8497; }
.user-card { max-width: 1040px; margin: auto; border-radius: 18px !important; box-shadow: 0 22px 60px rgba(30, 42, 68, .08); }
.table-tools { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.table-tools .arco-input-wrapper { max-width: 320px; border-radius: 9px; }
.table-tools > span { flex-shrink: 0; color: #8490a4; font-size: 12px; }
.member { display: grid; gap: 2px; white-space: nowrap; }
.member span { color: #8791a3; font-size: 12px; }
@media (max-width: 620px) { .user-page > header { align-items: flex-start; flex-direction: column; } }
`}},{group:`examples`,id:`routing`,title:`路由同步`,category:`History API`,description:`由 demo 地址栏驱动路径，并监听 iframe 内部导航。`,entryFile:`App.tsx`,files:{"App.tsx":`
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
`,"styles.css":`
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
`}},{group:`diagnostics`,id:`compile-error`,title:`编译错误`,category:`Error · Compile`,description:`故意保留一个 JSX 闭合错误，展示文件名、错误行列与源码上下文。`,entryFile:`App.tsx`,files:{"App.tsx":`
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
`}},{group:`diagnostics`,id:`dependency-error`,title:`依赖错误`,category:`Error · Dependency`,description:`引用一个不存在的 npm 包，展示包名、请求地址与加载失败原因。`,entryFile:`App.tsx`,depsInfo:{"@react-previewer/missing-card":`1.0.0`},files:{"App.tsx":`
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
`}},{group:`diagnostics`,id:`runtime-error`,title:`运行时错误`,category:`Error · Runtime`,description:`代码可以正常编译，但组件渲染时主动抛错，展示运行时堆栈与源码位置。`,entryFile:`App.tsx`,files:{"App.tsx":`
import React from 'react';
import { CrashPanel } from './CrashPanel';

export default function App() {
  return <CrashPanel />;
}
`,"CrashPanel.tsx":`
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
`}}];function u(e){let t=l.find(t=>t.id===e);return{files:{...t.files},activeFile:t.entryFile}}function d(e,t){if(t.type===`select`)return l.some(e=>e.id===t.id)?{selectedId:t.id,drafts:{...e.drafts,[t.id]:e.drafts[t.id]??u(t.id)}}:e;let n=e.drafts[e.selectedId],r=n;return t.type===`reset`&&(r=u(e.selectedId)),t.type===`open`&&t.file in n.files&&(r={...n,activeFile:t.file}),t.type===`edit`&&(r={...n,files:{...n.files,[n.activeFile]:t.value}}),{...e,drafts:{...e.drafts,[e.selectedId]:r}}}function f(){let[e,t]=(0,o.useReducer)(d,void 0,()=>({selectedId:l[0].id,drafts:{[l[0].id]:u(l[0].id)}})),[n,r]=(0,o.useState)(null),[i,a]=(0,o.useState)(null),[s,c]=(0,o.useState)(0),[f,p]=(0,o.useState)(`/`),[m,h]=(0,o.useState)(`/`),g=l.find(t=>t.id===e.selectedId),_=e.drafts[g.id],v=Object.keys(_.files).some(e=>_.files[e]!==g.files[e]),y=e=>{e!==g.id&&(t({type:`select`,id:e}),p(`/`),h(`/`),a(null),r(null))},b=()=>{c(e=>e+1),r(null),a(null)},x=e=>{e!==_.files[_.activeFile]&&(t({type:`edit`,value:e}),a(null),r(null))},S=()=>{t({type:`reset`}),b()},C=e=>{let t=`/`;try{let n=new URL(e.trim()||`/`,`https://preview.local`);t=`${n.pathname}${n.search}${n.hash}`}catch{}p(t),h(t)},w=e=>{r(e),e.error?.fileName&&t({type:`open`,file:e.error.fileName})};return{demo:g,..._,isDirty:v,status:n,sourceInfo:i,setSourceInfo:a,runtimeKey:`${g.id}:${s}`,path:f,routeInput:m,setRouteInput:h,navigate:C,selectDemo:y,updateFile:x,reset:S,refresh:b,receiveStatus:w,openFile:e=>t({type:`open`,file:e})}}var p=``+new URL(`rspackBrowser.worker-C7Pc4AtC.js`,import.meta.url).href,m={responsive:{label:`响应式`,width:`100%`},tablet:{label:`平板`,width:820},mobile:{label:`手机`,width:390}},h={babel:`babel`,"rspack-browser":{type:`rspack-browser`,rspack:{cdnDomain:`https://esm.sh`,workerFactory:()=>new Worker(new URL(p,import.meta.url),{type:`module`,name:`react-previewer-demo-rspack-browser`})}}},g={idle:`等待编译`,compiling:`正在编译`,"loading-js":`加载依赖`,"loading-css":`加载样式`,rendering:`正在渲染`,ready:`预览已就绪`,error:`预览出错`},_=i(),v={code:`m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18`,preview:`M2 5h20v14H2zM2 9h20`,refresh:`M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2`,reset:`M8 3 3 8l5 5M3 8h11a7 7 0 0 1 0 14`,inspect:`M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M9 9l3 9 2-4 4-2z`,search:`M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6`,arrow:`M5 12h14m-5-5 5 5-5 5`,close:`m6 6 12 12M6 18 18 6`,book:`M12 5v16M12 5C8 2 5 3 2 4v15c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1`,grid:`M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z`,warning:`m12 3 10 18H2zM12 9v5m0 3v1`,sun:`M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10`,moon:`M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11`,desktop:`M2 3h20v14H2zM8 21h8m-4-4v4`,tablet:`M4 2h16v20H4zM11 18h2`,mobile:`M7 2h10v20H7zM11 18h2`};function y({name:e,...t}){return(0,_.jsx)(`svg`,{width:`16`,height:`16`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`1.6`,strokeLinecap:`round`,strokeLinejoin:`round`,"aria-hidden":`true`,...t,children:(0,_.jsx)(`path`,{d:v[e]})})}function b({selectedId:e,onSelect:t}){let[n,r]=(0,o.useState)(``),i=l.filter(e=>`${e.title} ${e.category} ${e.description}`.toLowerCase().includes(n.trim().toLowerCase()));return(0,_.jsxs)(`aside`,{className:`demo-sidebar`,children:[(0,_.jsxs)(`div`,{className:`sidebar-heading`,children:[(0,_.jsx)(`span`,{className:`demo-eyebrow`,children:`PLAYGROUND`}),(0,_.jsx)(`span`,{className:`count-badge`,children:l.length})]}),(0,_.jsxs)(`label`,{className:`example-search`,children:[(0,_.jsx)(y,{name:`search`}),(0,_.jsx)(`input`,{"aria-label":`搜索示例`,placeholder:`搜索示例…`,value:n,onChange:e=>r(e.target.value)})]}),(0,_.jsxs)(`nav`,{className:`demo-list`,"aria-label":`预览示例`,children:[[`examples`,`diagnostics`].map(n=>{let r=i.filter(e=>e.group===n);return r.length>0&&(0,_.jsxs)(`div`,{className:`example-group`,children:[(0,_.jsx)(`span`,{className:`example-group__label`,children:n===`examples`?`开始探索`:`错误与恢复`}),r.map(r=>(0,_.jsxs)(`button`,{type:`button`,"aria-current":e===r.id?`true`:void 0,className:e===r.id?`is-active`:void 0,onClick:()=>t(r.id),children:[(0,_.jsx)(`span`,{className:`example-icon`,children:(0,_.jsx)(y,{name:n===`examples`?`grid`:`warning`})}),(0,_.jsxs)(`span`,{className:`example-name`,children:[(0,_.jsx)(`strong`,{children:r.title}),(0,_.jsx)(`small`,{children:r.category})]}),(0,_.jsx)(y,{name:`arrow`,className:`example-arrow`})]},r.id))]},n)}),i.length===0&&(0,_.jsx)(`p`,{className:`search-empty`,role:`status`,children:`没有匹配的示例，试试其他关键词。`})]}),(0,_.jsxs)(`a`,{className:`sidebar-guide`,href:`https://github.com/ForXd/react-previewer#readme`,target:`_blank`,rel:`noreferrer`,children:[(0,_.jsx)(`span`,{className:`guide-icon`,children:(0,_.jsx)(y,{name:`book`})}),(0,_.jsx)(`strong`,{children:`把预览接入你的产品`}),(0,_.jsxs)(`span`,{children:[`查看接入指南与 API 文档 `,(0,_.jsx)(y,{name:`arrow`})]})]}),(0,_.jsxs)(`div`,{className:`sidebar-footer`,children:[(0,_.jsx)(`span`,{className:`status-dot status-dot--ready`}),`浏览器内实时运行`]})]})}function x({label:e,value:t,options:n,onChange:r}){return(0,_.jsx)(`div`,{className:`toolbar-segment`,role:`group`,"aria-label":e,children:n.map(e=>(0,_.jsxs)(`button`,{type:`button`,"aria-label":e.label,"aria-pressed":t===e.value,className:t===e.value?`is-active`:void 0,onClick:()=>r(e.value),children:[e.icon,(0,_.jsx)(`span`,{children:e.label})]},e.value))})}function S(e){return(0,_.jsxs)(`header`,{className:`workbench-toolbar`,children:[(0,_.jsxs)(`div`,{className:`toolbar-actions`,children:[(0,_.jsxs)(`button`,{type:`button`,"aria-pressed":e.isInspecting,className:e.isInspecting?`is-active`:void 0,onClick:e.onInspect,children:[(0,_.jsx)(y,{name:`inspect`}),e.isInspecting?`退出检查`:`检查元素`]}),(0,_.jsx)(`button`,{type:`button`,onClick:e.onRefresh,"aria-label":`刷新预览`,title:`刷新预览`,children:(0,_.jsx)(y,{name:`refresh`})}),(0,_.jsx)(`button`,{type:`button`,onClick:e.onReset,disabled:!e.isDirty,"aria-label":`重置代码`,title:`重置当前示例`,children:(0,_.jsx)(y,{name:`reset`})})]}),(0,_.jsx)(x,{label:`编译器`,value:e.compiler,onChange:e.onCompiler,options:[{value:`babel`,label:`Babel`},{value:`rspack-browser`,label:`Rspack`}]}),(0,_.jsxs)(`div`,{className:`toolbar-display`,children:[(0,_.jsx)(x,{label:`预览宽度`,value:e.viewport,onChange:e.onViewport,options:[{value:`responsive`,label:`响应式`,icon:(0,_.jsx)(y,{name:`desktop`})},{value:`tablet`,label:`平板`,icon:(0,_.jsx)(y,{name:`tablet`})},{value:`mobile`,label:`手机`,icon:(0,_.jsx)(y,{name:`mobile`})}]}),(0,_.jsx)(x,{label:`预览主题`,value:e.skin,onChange:e.onSkin,options:[{value:`paper`,label:`Paper`,icon:(0,_.jsx)(y,{name:`sun`})},{value:`ink`,label:`Ink`,icon:(0,_.jsx)(y,{name:`moon`})}]})]})]})}function C({label:e,value:t,items:n,onChange:r,className:i}){let a=(0,o.useId)();return(0,_.jsx)(`div`,{className:i,role:`tablist`,"aria-label":e,children:n.map((e,i)=>(0,_.jsxs)(`button`,{id:e.id??`${a}-${i}`,type:`button`,role:`tab`,"aria-label":e.label,"aria-selected":t===e.value,"aria-controls":e.panelId,tabIndex:t===e.value?0:-1,className:t===e.value?`is-active`:void 0,onClick:()=>r(e.value),onKeyDown:e=>{let t;if(e.key===`ArrowRight`)t=(i+1)%n.length;else if(e.key===`ArrowLeft`)t=(i-1+n.length)%n.length;else if(e.key===`Home`)t=0;else if(e.key===`End`)t=n.length-1;else return;e.preventDefault(),r(n[t].value),(e.currentTarget.parentElement?.querySelectorAll(`[role="tab"]`))?.[t]?.focus()},children:[e.icon,(0,_.jsx)(`span`,{children:e.label}),e.changed&&(0,_.jsx)(`i`,{className:`modified-dot`,"aria-label":`已修改`})]},e.value))})}var w=(0,o.lazy)(()=>a(()=>import(`./MonacoCodeEditor-CSu0Iydq.js`).then(e=>({default:e.MonacoCodeEditor})),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url));function T({demo:e,files:t,activeFile:n,error:r,skin:i,sourceInfo:a,onSelectFile:s,onChange:c}){return(0,_.jsxs)(`section`,{className:`code-workspace`,"aria-label":`多文件编辑器`,children:[(0,_.jsxs)(`div`,{className:`code-workspace__tabs`,children:[(0,_.jsx)(C,{label:`示例文件`,value:n,onChange:s,className:`code-file-tabs`,items:Object.keys(t).map((n,r)=>({value:n,label:n,icon:n.endsWith(`.css`)?(0,_.jsx)(`span`,{className:`css-icon`,"aria-hidden":`true`,children:`#`}):(0,_.jsx)(y,{name:`code`}),changed:t[n]!==e.files[n],panelId:`code-file-panel`,id:`code-file-tab-${r}`}))}),(0,_.jsxs)(`span`,{className:`editor-auto`,children:[(0,_.jsx)(`span`,{className:`status-dot status-dot--ready`}),`自动编译`]})]}),(0,_.jsx)(`div`,{className:`code-editor-shell`,id:`code-file-panel`,role:`tabpanel`,"aria-labelledby":`code-file-tab-${Object.keys(t).indexOf(n)}`,children:(0,_.jsx)(o.Suspense,{fallback:(0,_.jsx)(`div`,{className:`code-editor-loading`,children:`正在载入编辑器…`}),children:(0,_.jsx)(w,{demoId:e.id,fileName:n,value:t[n]??``,error:r,onChange:c,theme:i===`paper`?`vs`:`vs-dark`,sourceInfo:a})})}),(0,_.jsxs)(`footer`,{className:`code-workspace__footer`,children:[(0,_.jsxs)(`span`,{children:[(0,_.jsx)(y,{name:`code`}),n.endsWith(`.css`)?`CSS`:`TypeScript JSX`]}),(0,_.jsxs)(`span`,{children:[(t[n]??``).split(`
`).length,` 行`,(0,_.jsx)(`span`,{className:`footer-divider`}),`UTF-8`,(0,_.jsx)(`span`,{className:`footer-divider`}),`Spaces: 2`]})]})]})}function E({sourceInfo:e,onClose:t,onOpenSource:n}){return e?(0,_.jsxs)(`aside`,{className:`inspector-panel`,"aria-label":`元素源码位置`,children:[(0,_.jsxs)(`header`,{children:[(0,_.jsxs)(`div`,{children:[(0,_.jsx)(`span`,{className:`demo-eyebrow`,children:`Inspector`}),(0,_.jsx)(`strong`,{children:e.file})]}),(0,_.jsx)(`button`,{type:`button`,onClick:t,"aria-label":`关闭源码面板`,children:`×`})]}),(0,_.jsxs)(`div`,{className:`inspector-panel__meta`,children:[(0,_.jsxs)(`span`,{children:[`Line `,e.startLine,`:`,e.startColumn]}),(0,_.jsxs)(`span`,{children:[`→ `,e.endLine,`:`,e.endColumn]})]}),(0,_.jsx)(`pre`,{children:e.content}),(0,_.jsx)(`button`,{type:`button`,className:`inspector-open`,onClick:n,children:`在编辑器中打开 →`})]}):null}function D(e){let t=m[e.viewport];return(0,_.jsxs)(`div`,{className:`preview-stage preview-stage--${e.skin}`,children:[(0,_.jsxs)(`div`,{className:`browser-shell`,style:{width:t.width,maxWidth:`100%`},children:[(0,_.jsxs)(`div`,{className:`browser-shell__bar`,children:[(0,_.jsxs)(`span`,{className:`browser-dots`,"aria-hidden":`true`,children:[(0,_.jsx)(`i`,{}),(0,_.jsx)(`i`,{}),(0,_.jsx)(`i`,{})]}),(0,_.jsxs)(`form`,{onSubmit:t=>{t.preventDefault(),e.onNavigate(e.routeInput)},children:[(0,_.jsx)(`span`,{children:`preview.local`}),(0,_.jsx)(`input`,{"aria-label":`预览路径`,value:e.routeInput,onChange:t=>e.onRouteInput(t.target.value),spellCheck:!1}),(0,_.jsx)(`button`,{type:`submit`,"aria-label":`打开预览路径`,children:(0,_.jsx)(y,{name:`arrow`})})]}),(0,_.jsx)(`span`,{className:`browser-shell__size`,children:typeof t.width==`number`?`${t.width}px`:`Auto`})]}),(0,_.jsx)(`div`,{className:`browser-shell__runtime`,children:(0,o.createElement)(n,{...e.previewProps,key:e.runtimeKey,classNames:{root:`demo-runtime demo-runtime--${e.skin}`,loading:`demo-runtime__loading`,error:`demo-runtime__error`,iframe:`demo-runtime__iframe`}})})]}),(0,_.jsx)(E,{sourceInfo:e.sourceInfo,onClose:e.onCloseInspector,onOpenSource:e.onOpenSource})]})}function O({status:e,compiler:t,isDirty:n,fileCount:r}){let i=e?.phase??`compiling`;return(0,_.jsxs)(`footer`,{className:`workbench-footer`,children:[(0,_.jsxs)(`div`,{className:`workbench-status`,role:`status`,"aria-live":`polite`,children:[(0,_.jsx)(`span`,{className:`status-dot status-dot--${i}`}),(0,_.jsx)(`strong`,{children:g[i]}),e?.compileDuration!=null&&(0,_.jsxs)(`span`,{className:`compile-duration`,children:[e.compileDuration,` ms`]})]}),(0,_.jsxs)(`div`,{className:`workbench-footer__meta`,children:[(0,_.jsxs)(`span`,{children:[r,` 个文件`]}),(0,_.jsx)(`span`,{children:t===`babel`?`Babel`:`Rspack`}),(0,_.jsx)(`span`,{className:n?`draft-label`:void 0,children:n?`草稿已保留`:`示例原始版本`})]})]})}function k(){let e=f(),[t,n]=(0,o.useState)(`babel`),[r,i]=(0,o.useState)(`paper`),[a,s]=(0,o.useState)(`responsive`),[l,u]=(0,o.useState)(`editor`),[d,p]=(0,o.useState)(!1),{demo:m}=e;return(0,_.jsxs)(`div`,{className:`demo-app demo-app--${r}`,children:[(0,_.jsxs)(`header`,{className:`demo-header`,children:[(0,_.jsxs)(`a`,{className:`demo-brand`,href:`#top`,"aria-label":`React Previewer demo 首页`,children:[(0,_.jsx)(`span`,{className:`brand-symbol`,children:(0,_.jsx)(y,{name:`code`})}),(0,_.jsx)(`strong`,{children:`React Previewer`}),(0,_.jsx)(`span`,{className:`brand-divider`}),(0,_.jsx)(`small`,{children:`Playground`})]}),(0,_.jsxs)(`div`,{className:`demo-header__meta`,children:[(0,_.jsx)(`a`,{href:`#ai`,children:`AI 生成页面 ↗`}),(0,_.jsxs)(`span`,{className:`demo-version`,children:[`v`,c]}),(0,_.jsxs)(`a`,{href:`https://github.com/ForXd/react-previewer`,target:`_blank`,rel:`noreferrer`,children:[`GitHub `,(0,_.jsx)(y,{name:`arrow`})]})]})]}),(0,_.jsxs)(`div`,{className:`demo-layout`,id:`top`,children:[(0,_.jsx)(b,{selectedId:m.id,onSelect:t=>{e.selectDemo(t),p(!1)}}),(0,_.jsxs)(`main`,{className:`demo-main`,children:[(0,_.jsxs)(`div`,{className:`workspace-heading`,children:[(0,_.jsxs)(`div`,{children:[(0,_.jsxs)(`span`,{className:`workspace-breadcrumb`,children:[`示例 `,(0,_.jsx)(`span`,{children:`/`}),` `,(0,_.jsx)(`strong`,{children:m.title})]}),(0,_.jsx)(`p`,{children:m.description})]}),(0,_.jsx)(`span`,{className:`language-badge`,children:m.category})]}),(0,_.jsxs)(`section`,{className:`workbench`,"aria-label":`React Previewer 工作台`,children:[(0,_.jsxs)(`div`,{className:`workbench-topbar`,children:[(0,_.jsx)(C,{label:`工作台视图`,value:l,onChange:u,className:`workbench-view-tabs`,items:[{value:`editor`,label:`编辑器`,icon:(0,_.jsx)(y,{name:`code`}),id:`editor-tab`,panelId:`editor-panel`},{value:`preview`,label:`预览`,icon:(0,_.jsx)(y,{name:`preview`}),id:`preview-tab`,panelId:`preview-panel`}]}),(0,_.jsx)(`span`,{className:`workspace-hint`,children:`编辑代码，即刻预览`})]}),(0,_.jsx)(S,{isInspecting:d,isDirty:e.isDirty,compiler:t,skin:r,viewport:a,onCompiler:n,onSkin:i,onViewport:e=>{s(e),u(`preview`)},onRefresh:e.refresh,onReset:e.reset,onInspect:()=>{p(!d),e.setSourceInfo(null),u(`preview`)}}),(0,_.jsx)(`div`,{id:`editor-panel`,role:`tabpanel`,"aria-labelledby":`editor-tab`,hidden:l!==`editor`,children:(0,_.jsx)(T,{demo:m,files:e.files,activeFile:e.activeFile,error:e.status?.error??null,skin:r,sourceInfo:e.sourceInfo,onSelectFile:e.openFile,onChange:e.updateFile})}),(0,_.jsx)(`div`,{id:`preview-panel`,role:`tabpanel`,"aria-labelledby":`preview-tab`,hidden:l!==`preview`,children:(0,_.jsx)(D,{runtimeKey:e.runtimeKey,skin:r,viewport:a,routeInput:e.routeInput,onRouteInput:e.setRouteInput,onNavigate:e.navigate,sourceInfo:e.sourceInfo,onCloseInspector:()=>e.setSourceInfo(null),onOpenSource:()=>{e.sourceInfo&&e.openFile(e.sourceInfo.file),u(`editor`)},previewProps:{files:e.files,entryFile:m.entryFile,depsInfo:m.depsInfo,dependencyStyles:m.dependencyStyles,compiler:h[t],initialPath:e.path,isInspecting:d,iframeTitle:`${m.title} preview`,onElementClick:e.setSourceInfo,onRouteChange:t=>e.navigate(t.href),onStatusChange:e.receiveStatus}})}),(0,_.jsx)(O,{status:e.status,compiler:t,isDirty:e.isDirty,fileCount:Object.keys(e.files).length})]}),(0,_.jsxs)(`p`,{className:`workspace-footnote`,children:[`自由修改示例，探索组件的每一种可能。`,(0,_.jsx)(`span`,{children:`草稿仅在当前页面会话中保留`})]})]})]})]})}var A=(0,o.lazy)(()=>a(()=>import(`./AiWorkbench-BC0HhAFm.js`),__vite__mapDeps([7,1,2,8,9,10]),import.meta.url));function j(){let[e,t]=(0,o.useState)(window.location.hash===`#ai`);return(0,o.useEffect)(()=>{let e=()=>t(window.location.hash===`#ai`);return window.addEventListener(`hashchange`,e),()=>window.removeEventListener(`hashchange`,e)},[]),e?(0,_.jsx)(o.Suspense,{fallback:(0,_.jsx)(`p`,{children:`正在打开 AI Studio…`}),children:(0,_.jsx)(A,{})}):(0,_.jsx)(k,{})}(0,s.createRoot)(document.getElementById(`root`)).render((0,_.jsx)(o.StrictMode,{children:(0,_.jsx)(j,{})}));