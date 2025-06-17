import React, { useEffect, useState, useRef } from 'react';
import { transform } from '@babel/standalone';

interface CodePreviewProps {
  files: Record<string, string>;
  depsInfo: Record<string, string>;
  entry?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ files, depsInfo, entry = '/App.tsx' }) => {
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const renderComponent = async () => {
      try {
        setError(null);
        
        // 创建一个沙箱环境
        const iframe = iframeRef.current;
        if (!iframe) return;
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;
        
        // 重置 iframe 内容
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>React Preview</title>
              <meta charset="UTF-8" />
              <!-- 添加 Arco Design CSS -->
              <link rel="stylesheet" href="https://unpkg.com/@arco-design/web-react@2.45.0/dist/css/arco.min.css" />
              <script type="importmap">
                {
                  "imports": ${JSON.stringify({
                    ...depsInfo,
                    'react-dom/client': 'https://esm.sh/react-dom@18.2.0/client'
                  })}
                }
              </script>
              <style id="styles"></style>
              <script>
                // 定义全局动态导入函数
                window.dynamicImport = (url) => {
                  return import(url);
                };
              </script>
              <script type="module">
                // 预加载 React 和 ReactDOM
                import React from 'react';
                import { createRoot } from 'react-dom/client';
                
                // 全局暴露 React 和 ReactDOM
                window.React = React;
                window.createRoot = createRoot;
              </script>
            </head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `);
        iframeDoc.close();
        
        // 创建虚拟文件系统
        const virtualFS: Record<string, string> = {};
        
        // 收集所有 CSS 文件路径，用于后续处理导入
        const cssFiles = new Set<string>();
        for (const path of Object.keys(files)) {
          if (path.endsWith('.css')) {
            cssFiles.add(path);
          }
        }
        
        // 转换所有文件为 ESM
        for (const [path, content] of Object.entries(files)) {
          try {
            // 处理 CSS 文件
            if (path.endsWith('.css')) {
              const styleEl = iframeDoc.getElementById('styles');
              if (styleEl) {
                styleEl.textContent += content;
              }
              // 为 CSS 文件创建一个空模块，以便导入时不会报错
              virtualFS[path] = 'export default {}; // CSS module placeholder';
              continue;
            }
            
            // 转换 JSX/TSX 为 JS
            let transformedCode = content;
            
            if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
              transformedCode = transform(content, {
                presets: ['react', 'typescript'],
                filename: path
              }).code;
            }
            
            // 处理导入路径 - 使用正则表达式匹配 import 语句
            transformedCode = transformedCode.replace(
              /import\s+(?:(?:\{[^}]*\})|(?:[^{]*))\s+from\s+['"]([^'"]*)['"];?/g,
              (match, importPath) => {
                // 处理相对路径
                if (importPath.startsWith('./') || importPath.startsWith('../')) {
                  // 简单的路径解析，不使用 URL 构造函数
                  const currentDir = path.substring(0, path.lastIndexOf('/') + 1);
                  let resolvedPath = resolvePath(currentDir, importPath);
                  return match.replace(importPath, resolvedPath);
                }
                return match;
              }
            );
            
            // 处理 CSS 导入 (import './styles.css' 形式)
            transformedCode = transformedCode.replace(
              /import\s+['"]([^'"]*\.css)['"];?/g,
              (match, importPath) => {
                // 解析相对路径
                if (importPath.startsWith('./') || importPath.startsWith('../')) {
                  // 简单的路径解析，不使用 URL 构造函数
                  const currentDir = path.substring(0, path.lastIndexOf('/') + 1);
                  let resolvedPath = resolvePath(currentDir, importPath);
                  
                  // 如果这个 CSS 文件存在于我们的文件系统中，则替换为空导入
                  if (cssFiles.has(resolvedPath)) {
                    return `// CSS import ${resolvedPath} handled by the preview system`;
                  }
                }
                return match; // 保留原始导入，可能会导致错误，但这是预期行为
              }
            );
            
            virtualFS[path] = transformedCode;
          } catch (err) {
            console.error(`Error transforming ${path}:`, err);
            setError(`Error transforming ${path}: ${err instanceof Error ? err.message : String(err)}`);
            return;
          }
        }
        
        // 获取 iframe 窗口
        const iframeWindow = iframe.contentWindow;
        if (!iframeWindow) return;

        console.log('virtural fs', virtualFS)
        
        // 等待 iframe 加载完成并确保 dynamicImport 函数已定义
        await new Promise<void>((resolve) => {
          const checkDynamicImport = () => {
            if (iframeWindow.dynamicImport) {
              resolve();
            } else {
              setTimeout(checkDynamicImport, 50);
            }
          };
          setTimeout(checkDynamicImport, 100);
        });
        
        // 添加虚拟导入解析器
        iframeWindow.importShim = async (specifier: string) => {
          if (virtualFS[specifier]) {
            const blob = new Blob([virtualFS[specifier]], { type: 'application/javascript' });
            const url = URL.createObjectURL(blob);
            try {
              // 使用动态导入函数
              const module = await iframeWindow.dynamicImport(url);
              URL.revokeObjectURL(url);
              return module;
            } catch (err) {
              URL.revokeObjectURL(url);
              throw err;
            }
          }
          
          // 外部依赖使用 importmap
          return iframeWindow.dynamicImport(specifier);
        };
        
        // 创建渲染脚本
        const renderScript = `
          (async () => {
            try {
              const entryModule = await importShim('${entry}');
              const EntryComponent = entryModule.default || Object.values(entryModule)[0];
              
              if (typeof EntryComponent !== 'function') {
                throw new Error('Entry module does not export a valid React component');
              }
              
              const root = createRoot(document.getElementById('root'));
              root.render(React.createElement(EntryComponent));
            } catch (error) {
              console.error('Error rendering component:', error);
              document.body.innerHTML = '<div style="color: red; padding: 20px;"><h3>Error:</h3><pre>' + error.stack + '</pre></div>';
            }
          })();
        `;
        
        // 执行渲染脚本
        const scriptEl = iframeDoc.createElement('script');
        scriptEl.type = 'module';
        scriptEl.textContent = renderScript;
        iframeDoc.body.appendChild(scriptEl);
        
      } catch (err) {
        console.error('Error rendering component:', err);
        setError(`Error rendering component: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    
    // 辅助函数：解析相对路径
    function resolvePath(basePath: string, relativePath: string): string {
      // 处理 ./ 开头的路径
      if (relativePath.startsWith('./')) {
        return basePath + relativePath.substring(2);
      }
      
      // 处理 ../ 开头的路径
      if (relativePath.startsWith('../')) {
        // 获取父目录
        const parentDir = basePath.split('/').slice(0, -2).join('/') + '/';
        return resolvePath(parentDir, relativePath.substring(3));
      }
      
      // 处理绝对路径
      if (relativePath.startsWith('/')) {
        return relativePath;
      }
      
      // 默认情况，直接拼接
      return basePath + relativePath;
    }
    
    renderComponent();
  }, [files, depsInfo, entry]);
  
  return (
    <div className="code-preview-container">
      {error ? (
        <div className="code-preview-error">
          <h3>Error:</h3>
          <pre>{error}</pre>
        </div>
      ) : (
        <iframe 
          ref={iframeRef}
          className="code-preview-iframe"
          title="React Component Preview"
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      )}
    </div>
  );
};

export default CodePreview;