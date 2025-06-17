import React, { useState } from 'react';
import CodePreview from './CodePreview';
import './CodePreview.css';

const CodePreviewExample: React.FC = () => {
  // 示例代码文件
  const [files, setFiles] = useState<Record<string, string>>({
    '/App.tsx': `
import React, { useState } from 'react';
import './styles.css';
import {Test} from './Test.tsx';


const App: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="app-container">
      <Test />
      <h1>动态渲染的组件</h1>
      <p>这是一个通过 ESM 动态加载的 React 组件</p>
      <button onClick={() => setCount(count + 1)}>
        点击计数: {count}
      </button>
    </div>
  );
};

export default App;
`,
'Test.tsx':   `
import {Button } from '@arco-design/web-react';
export const Test = () => {
    return (
        <div>
            <Button>test11</Button>
        </div>
    )
}
`,
    '/styles.css': `
.app-container {
  padding: 20px;
  border: 2px solid #61dafb;
  border-radius: 8px;
  font-family: Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #282c34;
}

button {
  background-color: #61dafb;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #21a1c7;
}
`
  });

  // 依赖信息
  const depsInfo = {
    'react': 'https://esm.sh/react@18.2.0',
    'react-dom': 'https://esm.sh/react-dom@18.2.0',
    'react/jsx-runtime': 'https://esm.sh/react@18.2.0/jsx-runtime',
    '@arco-design/web-react': 'https://esm.sh/@arco-design/web-react@2.45.0?external=react,react-dom',
  };

  // 编辑器状态
  const [appCode, setAppCode] = useState(files['/App.tsx']);
  const [cssCode, setCssCode] = useState(files['/styles.css']);

  // 更新代码并重新渲染
  const updateCode = () => {
    setFiles({
      '/App.tsx': appCode,
      '/styles.css': cssCode
    });
  };

  return (
    <div className="code-preview-example">
      <div className="editors">
        <div className="editor">
          <h3>App.tsx</h3>
          <textarea
            value={appCode}
            onChange={(e) => setAppCode(e.target.value)}
            rows={15}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
        
        <div className="editor">
          <h3>styles.css</h3>
          <textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            rows={15}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
        </div>
        
        <button 
          onClick={updateCode}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          更新预览
        </button>
      </div>
      
      <div className="preview">
        <h3>预览</h3>
        <CodePreview files={files} depsInfo={depsInfo} entry="/App.tsx" />
      </div>
    </div>
  );
};

export default CodePreviewExample;