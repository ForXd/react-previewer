// utils/HTMLGenerator.ts
import { COMPONENT_LIBRARY_STYLE } from '../constant';

export class HTMLGenerator {
  generatePreviewHTML(entryUrl: string): string {
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
        ${this.getComponentLibraryStyles()}
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script type="importmap">
        {
          "imports": {
            "react": "https://esm.sh/react@18.2.0",
            "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
            "react-dom": "https://esm.sh/react-dom@18.2.0"
          }
        }
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
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

  private getComponentLibraryStyles(): string {
    return Object.keys(COMPONENT_LIBRARY_STYLE)
      .map((pkgName) => `<link rel="stylesheet" href="${COMPONENT_LIBRARY_STYLE[pkgName]}">`)
      .join('\n');
  }

  private getPreviewScript(entryUrl: string): string {
    return `
      import * as React from 'react';
      window.React = React;
      import { createRoot } from 'react-dom/client';
      import App from '${entryUrl}';
      
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

      try {
        const root = createRoot(document.getElementById('root'));
        root.render(React.createElement(App));
        
        setTimeout(() => {
          addInspectStyles();
          console.log('Initial inspect styles added');
          
          // iframe 加载完成后，主动请求当前的检查模式状态
          window.parent.postMessage({
            type: 'request-inspect-state'
          }, '*');
        }, 100);
      } catch (error) {
        sendMessage('runtime-error', {
          message: error.message,
          stack: error.stack
        });
      }
    `;
  }
}