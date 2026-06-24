var e=new Set([`antd`]);function t(e){if(e.startsWith(`@`)){let t=e.split(`/`);return t.length>=2?{packageName:`${t[0]}/${t[1]}`,subPath:t.slice(2).join(`/`)}:{packageName:e,subPath:``}}let t=e.indexOf(`/`);return t===-1?{packageName:e,subPath:``}:{packageName:e.substring(0,t),subPath:e.substring(t+1)}}function n(n,r={}){let{target:i=`es2022`,bundle:a=!1,external:o=[],alias:s={},keepNames:c=!1}=r,l={},u={};return Object.entries(n).forEach(([n,r])=>{let{packageName:d,subPath:f}=t(n),p=`https://esm.sh/${s[d]||d}@${r}`;f&&(p+=`/${f}`);let m=new URLSearchParams;i&&m.append(`target`,i),(a||e.has(d))&&m.append(`bundle`,``),o.length>0&&d!==`react`&&m.append(`external`,o.join(`,`)),c&&m.append(`keep-names`,``);let h=m.toString();h&&(p+=`?${h}`),l[n]=p,u[n]=p}),{dependencies:l,importMap:{imports:u}}}function r(e){return`<script type="importmap">
${JSON.stringify({imports:e},null,2)}
<\/script>`}function i(e,t={},r=[]){let i=n(e,t).dependencies,a=Object.entries(i).map(([e,t])=>({name:e,url:t}));return`
    // 动态依赖加载器
    const dynamicDependencyLoader = {
      dependencies: new Map(),
      loadedCount: 0,
      totalCount: 0,
      
      init() {
        this.moduleCache = new Map();
        this.styleCache = new Map();
      },
      
      addDependencies(deps) {
        deps.forEach(dep => {
          this.dependencies.set(dep.name, { url: dep.url, status: 'pending' });
          this.totalCount++;
        });
        this.updateUI();
      },
      
      setDependencyStatus(name, status, error = null) {
        const dep = this.dependencies.get(name);
        if (dep) {
          const wasDone = dep.status === 'loaded' || dep.status === 'cached' || dep.status === 'error';
          dep.status = status;
          if ((status === 'loaded' || status === 'cached' || status === 'error') && !wasDone) {
            this.loadedCount++;
          }
          if (error) dep.error = error;
          this.updateUI();
        }
      },

      ensureResource(name, url) {
        if (!this.dependencies.has(name)) {
          this.dependencies.set(name, { url, status: 'pending' });
          this.totalCount++;
          this.updateUI();
        }
      },
      
      updateUI() {
        const active = Array.from(this.dependencies.entries()).find(([, dep]) => dep.status === 'loading');
        this.postStatus(active?.[0]);
      },

      postStatus(activeName = '') {
        const progress = this.totalCount > 0 ? Math.round((this.loadedCount / this.totalCount) * 100) : 100;
        const phase = activeName.startsWith('style:') || activeName.startsWith('css:') || activeName.startsWith('inline:') || activeName === 'tailwindcss'
          ? 'loading-css'
          : 'loading-js';
        window.parent.postMessage({
          type: 'resource-status',
          data: {
            phase,
            resourceTotal: this.totalCount,
            resourceLoaded: this.loadedCount,
            resourceProgress: progress,
            currentResource: activeName || ''
          }
        }, '*');
      },
    };
    
    // 初始化动态依赖加载器
    dynamicDependencyLoader.init();
    
    // 添加依赖列表
    const dependencyList = ${JSON.stringify(a)};
    const styleResourceList = ${JSON.stringify(r)};
    const tailwindResource = { name: 'tailwindcss', url: 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.10' };
    const resourceList = [
      ...dependencyList,
      ...styleResourceList.map((resource) => ({
        name: \`style:\${resource.name}\`,
        url: resource.url
      })),
      tailwindResource
    ];
    dynamicDependencyLoader.addDependencies(resourceList);
    
    // 预加载依赖函数
    async function preloadDependency(name, url) {
      try {
        dynamicDependencyLoader.setDependencyStatus(name, 'loading');
        
        const startTime = Date.now();
        
        await dynamicDependencyLoader.loadModule(name, url);
        
        const loadTime = Date.now() - startTime;
        
        // 根据加载时间和网络状况判断是否为缓存
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let cacheThreshold = 50; // 默认缓存阈值
        
        if (connection) {
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            cacheThreshold = 30; // 慢网络降低缓存阈值
          } else if (connection.effectiveType === '4g') {
            cacheThreshold = 80; // 快网络提高缓存阈值
          }
        }
        
        if (loadTime < cacheThreshold) {
          dynamicDependencyLoader.setDependencyStatus(name, 'cached');
        } else {
          dynamicDependencyLoader.setDependencyStatus(name, 'loaded');
        }
        
      } catch (error) {
        dynamicDependencyLoader.setDependencyStatus(name, 'error');
        console.error(\`❌ 依赖 \${name} 加载失败:\`, error);
        
        // 发送错误消息到父窗口
        window.parent.postMessage({
          type: 'dependency-error',
          data: {
            name: name,
            url: url,
            error: error.message
          }
        }, '*');
      }
    }

    dynamicDependencyLoader.loadModule = async function(name, url) {
      if (this.moduleCache.has(url)) return this.moduleCache.get(url);
      const promise = import(url);
      this.moduleCache.set(url, promise);
      return promise;
    };

    function applyCrossOrigin(element, url) {
      try {
        const resourceUrl = new URL(url, window.location.href);
        if (resourceUrl.origin !== window.location.origin) {
          element.crossOrigin = 'anonymous';
        }
      } catch (error) {
        element.crossOrigin = 'anonymous';
      }
    }

    dynamicDependencyLoader.loadStyle = async function(name, url) {
      this.ensureResource(name, url);
      if (this.styleCache.has(url)) return this.styleCache.get(url);
      this.setDependencyStatus(name, 'loading');
      const promise = new Promise((resolve) => {
        const existing = Array.from(document.querySelectorAll('link[data-react-preview-style]'))
          .find((node) => node.getAttribute('data-react-preview-style') === url);
        if (existing) {
          resolve(existing);
          return;
        }

        const link = document.createElement('link');
        const timeout = window.setTimeout(() => {
          window.parent.postMessage({
            type: 'resource-error',
            data: { name, url, error: 'CSS load timeout' }
          }, '*');
          resolve(link);
        }, 8000);

        link.rel = 'stylesheet';
        applyCrossOrigin(link, url);
        link.href = url;
        link.setAttribute('data-react-preview-style', url);
        link.onload = () => {
          window.clearTimeout(timeout);
          resolve(link);
        };
        link.onerror = () => {
          window.clearTimeout(timeout);
          window.parent.postMessage({
            type: 'resource-error',
            data: { name, url, error: 'CSS load failed' }
          }, '*');
          resolve(link);
        };
        document.head.appendChild(link);
      });
      this.styleCache.set(url, promise);
      promise.then(() => this.setDependencyStatus(name, 'loaded'));
      return promise;
    };

    dynamicDependencyLoader.injectStyle = async function(name, cssText) {
      const key = \`inline:\${name}\`;
      this.ensureResource(key, key);
      if (this.styleCache.has(key)) return this.styleCache.get(key);
      this.setDependencyStatus(key, 'loading');
      const style = document.createElement('style');
      style.setAttribute('data-react-preview-style', key);
      style.textContent = cssText;
      document.head.appendChild(style);
      const promise = Promise.resolve(style);
      this.styleCache.set(key, promise);
      promise.then(() => this.setDependencyStatus(key, 'loaded'));
      return promise;
    };

    window.__reactPreviewResourceLoader = dynamicDependencyLoader;
    window.__reactPreviewLoadStyle = (url, name = url) => dynamicDependencyLoader.loadStyle(name, url);
    window.__reactPreviewInjectStyle = (name, cssText) => dynamicDependencyLoader.injectStyle(name, cssText);

    async function preloadStyle(name, url) {
      try {
        dynamicDependencyLoader.setDependencyStatus(name, 'loading');
        await dynamicDependencyLoader.loadStyle(name, url);
        dynamicDependencyLoader.setDependencyStatus(name, 'loaded');
      } catch (error) {
        dynamicDependencyLoader.setDependencyStatus(name, 'error', error.message);
      }
    }

    async function preloadTailwind() {
      try {
        dynamicDependencyLoader.setDependencyStatus(tailwindResource.name, 'loading');
        await new Promise((resolve) => {
          if (window.tailwind) {
            resolve(window.tailwind);
            return;
          }
          const script = document.createElement('script');
          const timeout = window.setTimeout(resolve, 8000);
          applyCrossOrigin(script, tailwindResource.url);
          script.src = tailwindResource.url;
          script.onload = () => {
            window.clearTimeout(timeout);
            resolve(script);
          };
          script.onerror = () => {
            window.clearTimeout(timeout);
            window.parent.postMessage({
              type: 'resource-error',
              data: { name: tailwindResource.name, url: tailwindResource.url, error: 'Tailwind CDN load failed' }
            }, '*');
            resolve(script);
          };
          document.head.appendChild(script);
        });
        dynamicDependencyLoader.setDependencyStatus(tailwindResource.name, 'loaded');
      } catch (error) {
        dynamicDependencyLoader.setDependencyStatus(tailwindResource.name, 'error', error.message);
      }
    }
    
    // 开始预加载所有依赖
    Promise.all(
      [
        ...dependencyList.map(dep => preloadDependency(dep.name, dep.url)),
        ...styleResourceList.map(resource => preloadStyle(\`style:\${resource.name}\`, resource.url)),
        preloadTailwind()
      ]
    ).then(() => {
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    }).catch(error => {
      console.error('依赖加载过程中出现错误:', error);
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    });
  `}var a={"@arco-design/web-react":`https://esm.sh/@arco-design/web-react@2.66.1/dist/css/arco.min.css`,antd:`https://esm.sh/antd@5.18.0/dist/reset.css`},o={react:`18.2.0`,"react-dom":`18.2.0`,"@arco-design/web-react":`2.66.1`,"@arco-design/web-react/icon":`2.66.1`},s={target:`es2022`,bundle:!1,external:[`react`,`react-dom`]},c=`modulepreload`,l=function(e){return`https://fastly.jsdelivr.net/gh/ForXd/react-previewer@main/page/`+e},u={},d=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=l(t,n),t in u)return;u[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:c,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};export{i as a,s as i,a as n,r as o,o as r,n as s,d as t};