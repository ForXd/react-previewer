export const demo1 = {
  "App.tsx": "import { useState } from 'react';\nimport { Form, Grid, Message } from '@arco-design/web-react';\nimport { Search } from './Search';\nimport { Table } from './Table';\nimport { Modal } from './Modal';\n\nconst App = () => {\n  const [form] = Form.useForm();\n  const [data, setData] = useState([]);\n  const [visible, setVisible] = useState(false);\n  const [currentRecord, setCurrentRecord] = useState(null);\n\n  const handleSearch = (values) => {\n    // 模拟搜索逻辑\n    setData([{ id: 1, name: 'Example', amount: 100, date: '2023-10-01' }]);\n  };\n\n  const handleAdd = () => {\n    setCurrentRecord(null);\n    setVisible(true);\n  };\n\n  const handleEdit = (record) => {\n    setCurrentRecord(record);\n    setVisible(true);\n  };\n\n  const handleDelete = (record) => {\n    Message.success('删除成功');\n    setData(data.filter(item => item.id !== record.id));\n  };\n\n  const handleSubmit = (values) => {\n    if (currentRecord) {\n      setData(data.map(item => item.id === currentRecord.id ? { ...item, ...values } : item));\n    } else {\n      setData([...data, { id: data.length + 1, ...values }]);\n    }\n    setVisible(false);\n  };\n\n  return (\n    <div>\n      <Search form={form} onSearch={handleSearch} onAdd={handleAdd} />\n      <Table data={data} onEdit={handleEdit} onDelete={handleDelete} />\n      <Modal visible={visible} onCancel={() => setVisible(false)} onSubmit={handleSubmit} record={currentRecord} />\n    </div>\n  );\n\n};\n\nexport default App;",
  "Search.tsx": "import { Button, Form, Grid, Input, DatePicker } from '@arco-design/web-react';\n\nexport const Search = ({ form, onSearch, onAdd }) => {\n  return (\n    <Form form={form} layout=\"vertical\" onFinish={onSearch}>\n      <Grid.Row gutter={24}>\n        <Grid.Col span={6}>\n          <Form.Item label=\"名称\" field=\"name\">\n            <Input placeholder=\"请输入名称\" />\n          </Form.Item>\n        </Grid.Col>\n        <Grid.Col span={6}>\n          <Form.Item label=\"金额\" field=\"amount\">\n            <InputNumber placeholder=\"请输入金额\" />\n          </Form.Item>\n        </Grid.Col>\n        <Grid.Col span={6}>\n          <Form.Item label=\"日期\" field=\"date\">\n            <DatePicker placeholder=\"请选择日期\" />\n          </Form.Item>\n        </Grid.Col>\n      </Grid.Row>\n      <Grid.Row>\n        <Grid.Col span={24} style={{ textAlign: 'right' }}>\n          <Button type=\"primary\" htmlType=\"submit\">搜索</Button>\n          <Button style={{ marginLeft: 12 }} onClick={onAdd}>新增</Button>\n        </Grid.Col>\n      </Grid.Row>\n    </Form>\n  );\n};\n",
  "Table.tsx": "import { Button, Table as ArcoTable } from '@arco-design/web-react';\n\nexport const Table = ({ data, onEdit, onDelete }) => {\n  const columns = [\n    { title: '名称', dataIndex: 'name' },\n    { title: '金额', dataIndex: 'amount' },\n    { title: '日期', dataIndex: 'date' },\n    {\n      title: '操作',\n      render: (_, record) => (\n        <>\n          <Button type=\"text\" onClick={() => onEdit(record)}>编辑</Button>\n          <Button type=\"text\" status=\"danger\" onClick={() => onDelete(record)}>删除</Button>\n        </>\n      ),\n    },\n  ];\n\n  return <ArcoTable columns={columns} data={data} />;\n};\n",
  "Modal.tsx": "import { Button, Form, Input, InputNumber, DatePicker, Modal as ArcoModal } from '@arco-design/web-react';\n\nexport const Modal = ({ visible, onCancel, onSubmit, record }) => {\n  const [form] = Form.useForm();\n\n  const handleOk = () => {\n    form.validate().then(values => {\n      onSubmit(values);\n    });\n  };\n\n  return (\n    <ArcoModal\n      title={record ? '编辑记录' : '新增记录'}\n      visible={visible}\n      onCancel={onCancel}\n      onOk={handleOk}\n    >\n      <Form form={form} initialValues={record}>\n        <Form.Item label=\"名称\" field=\"name\" rules={[{ required: true, message: '请输入名称' }]}>\n          <Input placeholder=\"请输入名称\" />\n        </Form.Item>\n        <Form.Item label=\"金额\" field=\"amount\" rules={[{ required: true, message: '请输入金额' }]}>\n          <InputNumber placeholder=\"请输入金额\" />\n        </Form.Item>\n        <Form.Item label=\"日期\" field=\"date\" rules={[{ required: true, message: '请选择日期' }]}>\n          <DatePicker placeholder=\"请选择日期\" />\n        </Form.Item>\n      </Form>\n    </ArcoModal>\n  );\n};\n",
  "deps.json": "{\"@arco-design/web-react\": \"^2.45.0\"\n  }"
}

export const demo2 = {
  'App.tsx': `
      import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Message,
  Card,
  Typography
} from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete } from '@arco-design/web-react/icon';
import {Button as CustomButton} from './components/Button';
// import './styles.css';


interface User {
  id: string;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // 模拟初始数据
  useEffect(() => {
    const initialUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { id: '3', name: 'Robert Johnson', email: 'robert@example.com' },
    ];
    setUsers(initialUsers);
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id));
        Message.success('删除成功');
      },
    });
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validate();
      
      if (editingUser) {
        // 更新
        setUsers(
          users.map(user => 
            user.id === editingUser.id ? { ...user, ...values } : user
          )
        );
        Message.success('更新成功');
      } else {
        // 新增
        const newUser = {
          id: Date.now().toString(),
          ...values,
        };
        setUsers([...users, newUser]);
        Message.success('添加成功');
      }
      
      setVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'operations',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            status="danger" 
            size="small" 
            icon={<IconDelete />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
      <Card>
        <div className="header">
          <Typography.Title heading={4}>用户管理</Typography.Title>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
            添加用户
          </Button>
          <CustomButton>11</CustomButton>
        </div>
        
        <Table 
          columns={columns} 
          data={users} 
          rowKey="id"
          pagination={{
            showTotal: true,
            pageSize: 10,
          }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="姓名"
            field="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            field="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;

    `,
  'components/Button.tsx': `
      import React from 'react';
      import '../styles.css';

      interface ButtonProps {
        children: React.ReactNode;
        onClick: () => void;
      }

      export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
        return (
          <button 
            onClick={onClick}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {children}
          </button>
        );
      };
    `,
  'styles.css': `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        background: blue;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    `,
}


export const demo3 = {
  "App.tsx": "import React, { useEffect, useRef } from 'react';\nimport * as echarts from 'echarts';\n\nconst App: React.FC = () => {\n  const chartRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (chartRef.current) {\n      const chart = echarts.init(chartRef.current);\n      const option = {\n        title: {\n          text: 'ECharts 示例'\n        },\n        tooltip: {},\n        xAxis: {\n          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']\n        },\n        yAxis: {},\n        series: [\n          {\n            name: '销量',\n            type: 'bar',\n            data: [5, 20, 36, 10, 10, 20]\n          }\n        ]\n      };\n      chart.setOption(option);\n    }\n  }, []);\n\n  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;\n};\n\nexport default App;\n",
  "deps.json": "{\n    \"echarts\": \"^5.4.0\"\n  }"
}