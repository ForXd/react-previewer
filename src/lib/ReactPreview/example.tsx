import React, { useState } from 'react';
import { ReactPreviewer } from './preview/ReactPreviewer';
import { demo1, demo2, demo3 } from './test/demo';

const ExampleUsage: React.FC = () => {
  const [files, setFiles] = useState<Record<string, string>>(demo1);

  const getFiles  = () => {
    const files1 = {...files};
    delete files1['deps.json'];
    return files1;
  }

  const getDeps = () => {
    try {
      return JSON.parse(files['deps.json']);
    } catch (error) {
      console.error('Parse deps.json error:', error);
      return {};
    }
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <select onChange={v => {
        if (v.target.value === 'demo1') {
          setFiles(demo1);
        } else if (v.target.value === 'demo2') {
          setFiles(demo2);
        } else if (v.target.value === 'demo3') {
          setFiles(demo3);
        }
      }}>
        <option value="demo1">demo1</option>
        <option value="demo2">demo2</option>
        <option value="demo3">demo3</option>
      </select>
      <ReactPreviewer
        files={getFiles()}
        depsInfo={getDeps()}
        entryFile="App.tsx"
        onError={(error) => console.error('Preview error:', error)}
      />
    </div>
  );
};

export default ExampleUsage;
