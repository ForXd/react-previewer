// utils/HTMLGenerator.ts
import { COMPONENT_LIBRARY_STYLE, TRANSFORM_OPTIONS } from '../constant';
import { generateDynamicDependencyLoader, transformDepsToEsmLinks, generateImportMapScript } from '../DependencyResolver';
// import { createModuleLogger } from './Logger';

// const logger = createModuleLogger('HTMLGenerator');

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
        <div id="loading-overlay" class="loading-overlay" style="display: none;">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text" id="loading-text">正在加载资源...</div>
            <div class="loading-progress">
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill"></div>
              </div>
              <div class="progress-text" id="progress-text">0%</div>
            </div>
            <div class="loading-details" id="loading-details"></div>
            <div class="cache-info" id="cache-info" style="display: none;">
              <div class="cache-hit-rate">
                <span class="cache-icon">📦</span>
                <span class="cache-text">缓存命中率: <span id="cache-rate">0%</span></span>
              </div>
            </div>
          </div>
        </div>
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
      
      /* 加载覆盖层样式 - 现代化设计 */
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(8px);
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .loading-overlay.showing {
        opacity: 1;
        transform: scale(1);
      }
      
      .loading-overlay.hiding {
        opacity: 0;
        transform: scale(0.95);
      }
      
      .loading-content {
        text-align: center;
        max-width: 480px;
        padding: 3rem 2rem;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        box-shadow: 
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin: 1rem;
      }
      
      .loading-spinner {
        width: 56px;
        height: 56px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        margin: 0 auto 1.5rem;
        position: relative;
      }
      
      .loading-spinner::after {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        border: 3px solid transparent;
        border-top: 3px solid rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        animation: spin 2s linear infinite reverse;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 1.5rem;
        letter-spacing: -0.025em;
      }
      
      .loading-progress {
        margin-bottom: 1.5rem;
      }
      
      .progress-bar {
        width: 100%;
        height: 6px;
        background: #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 0.75rem;
        position: relative;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #3b82f6 100%);
        border-radius: 8px;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        width: 0%;
        position: relative;
        overflow: hidden;
      }
      
      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      .progress-text {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
        letter-spacing: 0.025em;
      }
      
      .loading-details {
        font-size: 0.875rem;
        color: #64748b;
        max-height: 120px;
        overflow-y: auto;
        text-align: left;
        background: #f8fafc;
        padding: 1rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }
      
      .loading-details::-webkit-scrollbar {
        width: 6px;
      }
      
      .loading-details::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }
      
      .loading-details::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      
      .loading-details::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      
      .loading-details .dependency-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f5f9;
        transition: all 0.2s ease;
      }
      
      .loading-details .dependency-item:last-child {
        border-bottom: none;
      }
      
      .loading-details .dependency-item:hover {
        background: rgba(59, 130, 246, 0.02);
        border-radius: 6px;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
        margin: 0 -0.5rem;
      }
      
      .dependency-name {
        font-weight: 500;
        color: #334155;
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.8125rem;
      }
      
      .dependency-status {
        font-size: 0.75rem;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        min-width: 60px;
        text-align: center;
        transition: all 0.2s ease;
      }
      
      .status-pending {
        background: #f1f5f9;
        color: #64748b;
      }
      
      .status-loading {
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        color: #1e40af;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      .status-loaded {
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        color: #166534;
      }
      
      .status-cached {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #92400e;
      }
      
      .status-error {
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .loading-content.completed {
        animation: successPulse 0.6s ease-out;
      }
      
      .loading-content.completed .loading-spinner {
        border-top-color: #10b981;
        animation: none;
      }
      
      .loading-content.completed .loading-spinner::after {
        border-top-color: rgba(16, 185, 129, 0.2);
        animation: none;
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
      
      /* 响应式设计 */
      @media (max-width: 640px) {
        .loading-content {
          max-width: 90vw;
          padding: 2rem 1.5rem;
          margin: 0.5rem;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
        }
        
        .loading-text {
          font-size: 1.125rem;
        }
        
        .loading-details {
          max-height: 100px;
          font-size: 0.8125rem;
        }
      }
      
      @media (max-width: 480px) {
        .loading-content {
          padding: 1.5rem 1rem;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
        }
        
        .loading-text {
          font-size: 1rem;
        }
        
        .dependency-status {
          font-size: 0.6875rem;
          padding: 0.1875rem 0.5rem;
        }
      }
      
      .cache-info {
        margin-top: 1rem;
        padding: 0.75rem;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-radius: 8px;
        border: 1px solid #f59e0b;
        animation: fadeIn 0.5s ease-out;
      }
      
      .cache-hit-rate {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        color: #92400e;
      }
      
      .cache-icon {
        font-size: 1rem;
      }
      
      .cache-text {
        letter-spacing: 0.025em;
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
        console.log('依赖就绪，开始渲染应用');
        renderApp();
      });
      
      // 如果没有依赖加载器或没有依赖，直接渲染
      if (typeof dynamicDependencyLoader === 'undefined' || dynamicDependencyLoader.totalCount === 0) {
        console.log('无依赖需要加载，直接渲染应用');
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
        console.log('Found elements with data attributes:', elements.length);
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
        console.log('iframe received message:', event.data);
        if (event.data.type === 'toggle-inspect') {
          isInspecting = event.data.enabled;
          console.log('Setting inspect mode to:', isInspecting);
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
