import type { DemoDefinition } from './types';

export const usersDemo: DemoDefinition = {
  group: 'examples',
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
