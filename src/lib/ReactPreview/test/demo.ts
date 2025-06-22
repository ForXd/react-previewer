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
  "deps.json": "{\"@arco-design/web-react\": \"2.66.1\"}"
}


export const demo3 = {
  "App.tsx": "import React, { useEffect, useRef } from 'react';\nimport * as echarts from 'echarts';\n\nconst App: React.FC = () => {\n  const chartRef = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    if (chartRef.current) {\n      const chart = echarts.init(chartRef.current);\n      const option = {\n        title: {\n          text: 'ECharts 示例'\n        },\n        tooltip: {},\n        xAxis: {\n          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']\n        },\n        yAxis: {},\n        series: [\n          {\n            name: '销量',\n            type: 'bar',\n            data: [5, 20, 36, 10, 10, 20]\n          }\n        ]\n      };\n      chart.setOption(option);\n    }\n  }, []);\n\n  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;\n};\n\nexport default App;\n",
  "deps.json": "{\n    \"echarts\": \"^5.4.0\"\n  }"
}

export const demo4 = {
  "App.tsx": `
import React, { useState } from 'react';
import "@arco-design/web-react/dist/css/arco.css";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Tailwind CSS + Arco Design 测试
          </h1>
          <p className="text-gray-600 mb-4">
            这个 demo 展示了 Tailwind CSS 和远程 CSS 导入的功能
          </p>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              减少
            </button>
            
            <span className="text-2xl font-bold text-blue-600 px-4 py-2 bg-blue-100 rounded">
              {count}
            </span>
            
            <button 
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              增加
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">卡片 1</h3>
            <p className="text-gray-600">这是一个使用 Tailwind CSS 样式的卡片</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">卡片 2</h3>
            <p className="text-gray-600">响应式网格布局</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">卡片 3</h3>
            <p className="text-gray-600">悬停效果和过渡动画</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
  `,
  "deps.json": "{\"@arco-design/web-react\": \"^2.45.0\"}"
}

export const demo5 = {
  'App.tsx': `
import React from 'react';

const App: React.FC = () => {
return (
  <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        检查模式测试
      </h1>
      <p className="text-gray-600 mb-4">
        点击检查按钮，然后刷新 iframe，检查模式应该会自动恢复。
      </p>
      <div className="space-y-3">
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          按钮 1
        </button>
        <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          按钮 2
        </button>
        <button className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
          按钮 3
        </button>
      </div>
    </div>
  </div>
);
};

export default App;
  `,
}

export const demo6 = {
  'App.tsx': `
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [errorType, setErrorType] = useState<string>('none');
  const [shouldThrow, setShouldThrow] = useState<boolean>(false);

  // 模拟异步错误
  useEffect(() => {
    if (shouldThrow && errorType === 'async') {
      setTimeout(() => {
        throw new Error('这是一个异步错误！');
      }, 1000);
    }
  }, [shouldThrow, errorType]);

  // 模拟事件处理错误
  const handleEventError = () => {
    throw new Error('这是一个事件处理错误！');
  };

  // 模拟状态更新错误
  const handleStateError = () => {
    setErrorType('state');
    // 在下一个渲染周期抛出错误
    setTimeout(() => {
      setShouldThrow(true);
    }, 100);
  };

  // 模拟引用错误
  const handleReferenceError = () => {
    // @ts-ignore
    // 这个 console.log 是故意保留的，用于测试错误捕获功能
    console.log(undefinedVariable);
  };

  // 模拟类型错误
  const handleTypeError = () => {
    const obj = null;
    // @ts-ignore
    obj.someMethod();
  };

  // 模拟语法错误（在运行时通过 eval）
  const handleSyntaxError = () => {
    try {
      eval('const x = {;');
    } catch (error) {
      throw new Error('语法错误：' + error.message);
    }
  };

  // 模拟网络错误
  const handleNetworkError = () => {
    fetch('/non-existent-endpoint')
      .then(response => {
        if (!response.ok) {
          throw new Error('网络请求失败：' + response.status);
        }
        return response.json();
      })
      .catch(error => {
        throw new Error('网络错误：' + error.message);
      });
  };

  // 模拟递归错误
  const handleRecursionError = () => {
    const recursiveFunction = () => {
      recursiveFunction();
    };
    recursiveFunction();
  };

  // 模拟内存错误
  const handleMemoryError = () => {
    const arr = [];
    while (true) {
      arr.push(new Array(1000000));
    }
  };

  // 模拟自定义错误
  const handleCustomError = () => {
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    throw new CustomError('这是一个自定义错误！');
  };

  // 模拟组件渲染错误
  const ErrorComponent: React.FC = () => {
    if (shouldThrow && errorType === 'render') {
      throw new Error('这是一个组件渲染错误！');
    }
    return <div>正常渲染的组件</div>;
  };

  return (
    <div className="p-8 bg-gradient-to-r from-red-50 to-orange-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            运行时错误测试
          </h1>
          <p className="text-gray-600 mb-6">
            点击下面的按钮来测试不同类型的运行时错误捕获功能
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleEventError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              事件错误
            </button>
            
            <button 
              onClick={handleReferenceError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              引用错误
            </button>
            
            <button 
              onClick={handleTypeError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              类型错误
            </button>
            
            <button 
              onClick={handleSyntaxError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              语法错误
            </button>
            
            <button 
              onClick={handleNetworkError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              网络错误
            </button>
            
            <button 
              onClick={handleCustomError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              自定义错误
            </button>
            
            <button 
              onClick={() => {
                setErrorType('async');
                setShouldThrow(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              异步错误
            </button>
            
            <button 
              onClick={handleStateError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              状态错误
            </button>
            
            <button 
              onClick={() => {
                setErrorType('render');
                setShouldThrow(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              渲染错误
            </button>
            
            <button 
              onClick={handleRecursionError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              递归错误
            </button>
            
            <button 
              onClick={handleMemoryError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              内存错误
            </button>
            
            <button 
              onClick={() => {
                setShouldThrow(false);
                setErrorType('none');
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              重置状态
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">当前状态</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">错误类型:</span> {errorType}</p>
            <p><span className="font-medium">是否抛出错误:</span> {shouldThrow ? '是' : '否'}</p>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-700 mb-2">错误组件测试区域:</h4>
            <ErrorComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
  `,
}

export const dependencyLoadingDemo = {
  "App.tsx": `import React from 'react';

const DependencyLoadingTest: React.FC = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>依赖加载测试</h2>
      
      <p>
        这个组件用于测试依赖加载功能。如果页面正常显示，说明以下依赖已成功加载：
      </p>
      
      <ul style={{ marginBottom: '20px' }}>
        <li>React 18.2.0</li>
        <li>React DOM 18.2.0</li>
        <li>Arco Design Web React 2.66.1</li>
      </ul>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          style={{ 
            padding: '8px 16px', 
            marginRight: '8px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(c => c + 1)}
        >
          点击次数: {count}
        </button>
        
        <button 
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setCount(0)}
        >
          重置
        </button>
      </div>
      
      <div style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          <strong>测试说明：</strong>
          <br />
          1. 页面加载时应该显示依赖加载进度
          <br />
          2. 加载完成后进度条应该消失
          <br />
          3. 按钮应该能正常响应点击事件
          <br />
          4. React 状态管理应该正常工作
        </p>
      </div>
    </div>
  );
};

export default DependencyLoadingTest;`,
  "deps.json": "{\"@arco-design/web-react\": \"2.66.1\"}"
};

export const arcoDesignDemo = {
  "App.tsx": `import React from 'react';

const ArcoDesignTest: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [arcoComponents, setArcoComponents] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 动态导入 Arco Design 组件
    const loadArcoComponents = async () => {
      try {
        const arco = await import('@arco-design/web-react');
        setArcoComponents(arco);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load Arco Design components:', error);
        setLoading(false);
      }
    };

    loadArcoComponents();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1890ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>正在加载 Arco Design 组件...</p>
        <style>{\`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        \`}</style>
      </div>
    );
  }

  if (!arcoComponents) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff4d4f' }}>
        <h3>Arco Design 组件加载失败</h3>
        <p>请检查网络连接或依赖配置</p>
      </div>
    );
  }

  const { Button, Space, Typography } = arcoComponents;
  const { Title, Paragraph } = Typography;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Title level={2}>Arco Design 组件测试</Title>
      
      <Paragraph>
        这个组件用于测试 Arco Design 组件的动态加载功能。
        如果页面正常显示，说明 Arco Design 依赖已成功加载。
      </Paragraph>
      
      <Space>
        <Button 
          type="primary" 
          onClick={() => setCount(c => c + 1)}
        >
          点击次数: {count}
        </Button>
        
        <Button 
          onClick={() => setCount(0)}
        >
          重置
        </Button>
      </Space>
      
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Paragraph style={{ margin: 0 }}>
          <strong>测试说明：</strong>
          <br />
          1. 页面加载时应该显示依赖加载进度
          <br />
          2. Arco Design 组件应该正常渲染
          <br />
          3. 按钮应该能正常响应点击事件
          <br />
          4. 组件样式应该正确显示
        </Paragraph>
      </div>
    </div>
  );
};

export default ArcoDesignTest;`,
  "deps.json": "{\"@arco-design/web-react\": \"2.66.1\"}"
};

export const simpleReactDemo = {
  "App.tsx": `import React from 'react';

const SimpleReactDemo: React.FC = () => {
  const [count, setCount] = React.useState(0);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>简单 React 组件测试</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>计数器: {count}</h3>
        <button 
          onClick={() => setCount(c => c + 1)}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          增加
        </button>
        <button 
          onClick={() => setCount(c => c - 1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4d4f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          减少
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>输入框测试</h3>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入内容"
          style={{
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            width: '200px'
          }}
        />
        <p>输入的内容: {inputValue}</p>
      </div>
      
      <div style={{ padding: '16px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
        <h4>测试说明:</h4>
        <ul>
          <li>✅ React 状态管理正常工作</li>
          <li>✅ 事件处理正常工作</li>
          <li>✅ 组件渲染正常</li>
          <li>✅ 依赖加载进度显示正常</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleReactDemo;`,
  "deps.json": "{}"
};

// 统一的 demo 配置 map
export const demoMap = {
  demo1: {
    name: 'Arco Design 基础',
    description: '基础的 Arco Design 组件使用示例',
    files: demo1,
    entryFile: 'App.tsx'
  },
  demo2: {
    name: '用户管理',
    description: '完整的用户管理 CRUD 功能',
    files: demo2,
    entryFile: 'App.tsx'
  },
  demo3: {
    name: 'ECharts 图表',
    description: 'ECharts 图表库集成示例',
    files: demo3,
    entryFile: 'App.tsx'
  },
  demo4: {
    name: 'Tailwind CSS + 远程 CSS',
    description: 'Tailwind CSS 和远程 CSS 导入功能测试',
    files: demo4,
    entryFile: 'App.tsx'
  },
  demo5: {
    name: '检查模式测试',
    description: '测试 iframe 刷新后检查模式状态恢复',
    files: demo5,
    entryFile: 'App.tsx'
  },
  demo6: {
    name: '运行时错误测试',
    description: '测试各种运行时错误的捕获和显示功能',
    files: demo6,
    entryFile: 'App.tsx'
  },
  dependencyLoadingDemo: {
    name: '依赖加载测试',
    description: '测试依赖加载功能',
    files: dependencyLoadingDemo,
    entryFile: 'App.tsx'
  },
  arcoDesignDemo: {
    name: 'Arco Design 组件测试',
    description: '测试 Arco Design 组件的动态加载功能',
    files: arcoDesignDemo,
    entryFile: 'App.tsx'
  },
  simpleReactDemo: {
    name: '简单 React 组件测试',
    description: '测试简单 React 组件的功能',
    files: simpleReactDemo,
    entryFile: 'App.tsx'
  }
};

// 导出 demo 列表，方便在组件中使用
export const demoList = Object.entries(demoMap).map(([key, config]) => ({
  key,
  ...config
}));