import { COMPONENT_LIBRARY_STYLE, TRANSFORM_OPTIONS } from '../constant';
import { generateDynamicDependencyLoader, transformDepsToEsmLinks, generateImportMapScript } from '../DependencyResolver';

export class HTMLGenerator {
  private cache = new Map<string, {
    dynamicLoaderScript: string;
    importMapScript: string;
  }>();

  generatePreviewHTML(
    entryUrl: string,
    depsInfo: Record<string, string> = {},
    dependencyStyles: Record<string, string | string[]> = {}
  ): string {
    // 合并默认依赖和传入的依赖
    const allDeps = {
      'react': '18.2.0',
      'react-dom': '18.2.0',
      'react-dom/client': '18.2.0',
      ...depsInfo
    };
    const styleResources = this.resolveStyleResources(allDeps, dependencyStyles);
    const cacheKey = JSON.stringify({ allDeps, styleResources });
    let cached = this.cache.get(cacheKey);

    if (!cached) {
      const dynamicLoaderScript = generateDynamicDependencyLoader(allDeps, TRANSFORM_OPTIONS, styleResources);
      const result = transformDepsToEsmLinks(allDeps, TRANSFORM_OPTIONS);
      const importMapScript = generateImportMapScript(result.importMap.imports);
      cached = { dynamicLoaderScript, importMapScript };
      this.cache.set(cacheKey, cached);
    }
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>React Preview</title>
        <style>
          ${this.getBaseStyles()}
        </style>
        ${cached.importMapScript}
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          ${cached.dynamicLoaderScript}
          ${this.getPreviewScript(entryUrl)}
        </script>
      </body>
      </html>
    `;
  }

  private getBaseStyles(): string {
    return `
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        background: #f8fafc;
      }
      #root {
        width: 100%;
        height: 100vh;
      }
      /* 检查模式相关样式，使用更高优先级避免被 Tailwind 覆盖 */
      .inspect-highlight {
        outline: 2px dashed #007acc !important;
        outline-offset: 2px !important;
        background-color: rgba(0, 122, 204, 0.1) !important;
      }
      .inspect-mode {
        cursor: crosshair !important;
      }
      .inspect-mode * {
        cursor: crosshair !important;
      }
      .inspect-clickable {
        position: relative;
      }
      .inspect-clickable::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid transparent;
        pointer-events: none;
        transition: border-color 0.2s ease;
      }
      .inspect-clickable:hover::after {
        border-color: #007acc;
        background-color: rgba(0, 122, 204, 0.05);
      }
    `;
  }

  private resolveStyleResources(
    depsInfo: Record<string, string>,
    dependencyStyles: Record<string, string | string[]>
  ): Array<{ name: string; url: string }> {
    const mergedStyles = {
      ...COMPONENT_LIBRARY_STYLE,
      ...dependencyStyles
    };

    return Object.entries(mergedStyles)
      .filter(([pkgName]) => pkgName in depsInfo)
      .flatMap(([pkgName, value]) => {
        const urls = Array.isArray(value) ? value : [value];
        return urls.map((url, index) => ({
          name: urls.length > 1 ? `${pkgName}:${index + 1}` : pkgName,
          url
        }));
      });
  }

  private getPreviewScript(entryUrl: string): string {
    return `
      // 等待依赖加载完成后再渲染应用
      async function renderApp() {
        try {
          window.parent.postMessage({
            type: 'resource-status',
            data: {
              phase: 'rendering',
              resourceTotal: dynamicDependencyLoader?.totalCount || 0,
              resourceLoaded: dynamicDependencyLoader?.loadedCount || 0,
              resourceProgress: dynamicDependencyLoader?.totalCount
                ? Math.round((dynamicDependencyLoader.loadedCount / dynamicDependencyLoader.totalCount) * 100)
                : 100
            }
          }, '*');

          // 现在导入依赖并渲染应用
          let React, createRoot, App;
          
          // 使用动态依赖加载器提供的 URL 导入依赖
          if (typeof dynamicDependencyLoader !== 'undefined') {
            const reactDep = dynamicDependencyLoader.dependencies.get('react');
            const reactDomDep = dynamicDependencyLoader.dependencies.get('react-dom/client');
            
            if (reactDep && reactDomDep) {
              React = await dynamicDependencyLoader.loadModule('react', reactDep.url);
              const reactDom = await dynamicDependencyLoader.loadModule('react-dom/client', reactDomDep.url);
              createRoot = reactDom.createRoot;
            } else {
              // 回退到默认导入
              React = await import('react');
              const reactDom = await import('react-dom/client');
              createRoot = reactDom.createRoot;
            }
          } else {
            // 回退到默认导入
            React = await import('react');
            const reactDom = await import('react-dom/client');
            createRoot = reactDom.createRoot;
          }
          
          window.React = React;
          App = await import('${entryUrl}');
          
          const root = createRoot(document.getElementById('root'));
          root.render(React.createElement(App.default));
          
          setTimeout(() => {
            addInspectStyles();
            
            // iframe 加载完成后，主动请求当前的检查模式状态
            window.parent.postMessage({
              type: 'request-inspect-state'
            }, '*');
            window.parent.postMessage({
              type: 'preview-ready',
              data: {
                phase: 'ready',
                resourceTotal: dynamicDependencyLoader?.totalCount || 0,
                resourceLoaded: dynamicDependencyLoader?.loadedCount || 0,
                resourceProgress: 100
              }
            }, '*');
          }, 100);
        } catch (error) {
          sendMessage('runtime-error', {
            message: error.message,
            stack: error.stack
          });
        }
      }
      
      // 监听依赖就绪事件
      window.addEventListener('dependencies-ready', () => {
        renderApp();
      });
      
      // 如果没有依赖加载器或没有依赖，直接渲染
      if (typeof dynamicDependencyLoader === 'undefined' || dynamicDependencyLoader.totalCount === 0) {
        renderApp();
      }
      
      // 错误处理
      window.addEventListener('error', (event) => {
        // 只传递可序列化的数据
        window.parent.postMessage({
          type: 'runtime-error',
          data: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          }
        }, '*');
      });

      window.addEventListener('unhandledrejection', (event) => {
        window.parent.postMessage({
          type: 'runtime-error',
          data: {
            message: event.reason?.message || 'Unhandled Promise Rejection',
            stack: event.reason?.stack
          }
        }, '*');
      });

      // 重写console方法以便调试
      const originalConsole = { ...console };
      ['log', 'warn', 'error', 'info'].forEach(method => {
        console[method] = (...args) => {
          originalConsole[method](...args);
          // 序列化 console 参数
          const serializedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg);
              } catch (e) {
                return String(arg);
              }
            }
            return arg;
          });
          
          window.parent.postMessage({
            type: 'console-log',
            data: { 
              level: method, 
              args: serializedArgs 
            }
          }, '*');
        };
      });

      // 检查模式相关功能
      let isInspecting = false;
      let currentHighlight = null;

      function addInspectStyles() {
        const elements = document.querySelectorAll('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        elements.forEach(el => {
          if (isInspecting) {
            el.classList.add('inspect-clickable');
          } else {
            el.classList.remove('inspect-clickable');
          }
        });
      }

      // 安全的消息发送函数
      function sendMessage(type, data) {
        try {
          // 确保数据是可序列化的
          const serializedData = JSON.parse(JSON.stringify(data));
          window.parent.postMessage({
            type: type,
            data: serializedData
          }, '*');
        } catch (error) {
          console.error('Failed to send message:', error);
          // 发送简化的错误信息
          window.parent.postMessage({
            type: 'runtime-error',
            data: {
              message: 'Failed to serialize message data: ' + error.message
            }
          }, '*');
        }
      }

      window.addEventListener('message', (event) => {
        if (event.data.type === 'toggle-inspect') {
          isInspecting = event.data.enabled;
          document.body.classList.toggle('inspect-mode', isInspecting);
          
          if (!isInspecting && currentHighlight) {
            currentHighlight.classList.remove('inspect-highlight');
            currentHighlight = null;
          }
          
          addInspectStyles();
        }
      });

      document.addEventListener('mouseover', (event) => {
        if (!isInspecting) return;
        
        const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        if (!target) return;
        
        if (currentHighlight && currentHighlight !== target) {
          currentHighlight.classList.remove('inspect-highlight');
        }
        
        target.classList.add('inspect-highlight');
        currentHighlight = target;
      });

      document.addEventListener('mouseout', (event) => {
        if (!isInspecting) return;
        
        const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
        if (target && currentHighlight === target) {
          target.classList.remove('inspect-highlight');
          currentHighlight = null;
        }
      });

      // 捕获阶段，无条件拦截所有点击，并主动处理源码元素点击
      document.addEventListener('click', (event) => {
        if (isInspecting) {
          const target = event.target.closest('[data-pipo-line][data-pipo-column][data-pipo-end-line][data-pipo-end-column][data-pipo-file]');
          if (target) {
            // 主动处理 element-click 逻辑
            const startLine = target.getAttribute('data-pipo-line');
            const endLine = target.getAttribute('data-pipo-end-line');
            const startColumn = target.getAttribute('data-pipo-column');
            const endColumn = target.getAttribute('data-pipo-end-column');
            const file = target.getAttribute('data-pipo-file');
            if (file && startLine && endLine && startColumn && endColumn) {
              const clickData = {
                file: String(file),
                startLine: parseInt(startLine, 10),
                endLine: parseInt(endLine, 10),
                startColumn: parseInt(startColumn, 10),
                endColumn: parseInt(endColumn, 10),
                x: Number(event.clientX),
                y: Number(event.clientY)
              };
              sendMessage('element-click', clickData);
            }
          }
          event.preventDefault();
          event.stopPropagation();
        }
      }, true);
    `;
  }

}
