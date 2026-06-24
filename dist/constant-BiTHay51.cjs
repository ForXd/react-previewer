//#region \0@oxc-project+runtime@0.127.0/helpers/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.127.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region src/lib/ReactPreview/preview/DependencyResolver.ts
var FORCE_BUNDLED_PACKAGES = new Set(["antd"]);
/**
* 解析包名和子路径
* @param packagePath 完整的包路径
* @returns 解析后的包名和子路径
*/
function parsePackagePath(packagePath) {
	if (packagePath.startsWith("@")) {
		const parts = packagePath.split("/");
		if (parts.length >= 2) return {
			packageName: `${parts[0]}/${parts[1]}`,
			subPath: parts.slice(2).join("/")
		};
		return {
			packageName: packagePath,
			subPath: ""
		};
	}
	const firstSlashIndex = packagePath.indexOf("/");
	if (firstSlashIndex === -1) return {
		packageName: packagePath,
		subPath: ""
	};
	return {
		packageName: packagePath.substring(0, firstSlashIndex),
		subPath: packagePath.substring(firstSlashIndex + 1)
	};
}
/**
* 将依赖信息转换为 esm.sh 链接
* @param depsInfo 依赖信息对象
* @param options ESM.sh 配置选项
* @returns 转换结果
*/
function transformDepsToEsmLinks(depsInfo, options = {}) {
	const { target = "es2022", bundle = false, external = [], alias = {}, keepNames = false } = options;
	const dependencies = {};
	const imports = {};
	Object.entries(depsInfo).forEach(([packagePath, version]) => {
		const { packageName, subPath } = parsePackagePath(packagePath);
		let esmUrl = `https://esm.sh/${alias[packageName] || packageName}@${version}`;
		if (subPath) esmUrl += `/${subPath}`;
		const params = new URLSearchParams();
		if (target) params.append("target", target);
		if (bundle || FORCE_BUNDLED_PACKAGES.has(packageName)) params.append("bundle", "");
		if (external.length > 0 && packageName !== "react") params.append("external", external.join(","));
		if (keepNames) params.append("keep-names", "");
		const queryString = params.toString();
		if (queryString) esmUrl += `?${queryString}`;
		dependencies[packagePath] = esmUrl;
		imports[packagePath] = esmUrl;
	});
	return {
		dependencies,
		importMap: { imports }
	};
}
/**
* 生成 HTML 中的 import map 脚本标签
* @param importMap 导入映射
* @returns HTML 脚本标签字符串
*/
function generateImportMapScript(importMap) {
	return `<script type="importmap">
${JSON.stringify({ imports: importMap }, null, 2)}
<\/script>`;
}
/**
* 生成动态依赖加载脚本
* @param depsInfo 依赖信息
* @param options ESM.sh 配置选项
* @returns 动态加载脚本字符串
*/
function generateDynamicDependencyLoader(depsInfo, options = {}, styleResources = []) {
	const dependencies = transformDepsToEsmLinks(depsInfo, options).dependencies;
	const dependencyList = Object.entries(dependencies).map(([name, url]) => ({
		name,
		url
	}));
	return `
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
    const dependencyList = ${JSON.stringify(dependencyList)};
    const styleResourceList = ${JSON.stringify(styleResources)};
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
  `;
}
//#endregion
//#region src/lib/ReactPreview/preview/constant.ts
var COMPONENT_LIBRARY_STYLE = {
	"@arco-design/web-react": "https://esm.sh/@arco-design/web-react@2.66.1/dist/css/arco.min.css",
	antd: "https://esm.sh/antd@5.18.0/dist/reset.css"
};
var DEFAULT_DEPENDENCIES = {
	react: "18.2.0",
	"react-dom": "18.2.0",
	"@arco-design/web-react": "2.66.1",
	"@arco-design/web-react/icon": "2.66.1"
};
var TRANSFORM_OPTIONS = {
	target: "es2022",
	bundle: false,
	external: ["react", "react-dom"]
};
//#endregion
Object.defineProperty(exports, "COMPONENT_LIBRARY_STYLE", {
	enumerable: true,
	get: function() {
		return COMPONENT_LIBRARY_STYLE;
	}
});
Object.defineProperty(exports, "DEFAULT_DEPENDENCIES", {
	enumerable: true,
	get: function() {
		return DEFAULT_DEPENDENCIES;
	}
});
Object.defineProperty(exports, "TRANSFORM_OPTIONS", {
	enumerable: true,
	get: function() {
		return TRANSFORM_OPTIONS;
	}
});
Object.defineProperty(exports, "_defineProperty", {
	enumerable: true,
	get: function() {
		return _defineProperty;
	}
});
Object.defineProperty(exports, "generateDynamicDependencyLoader", {
	enumerable: true,
	get: function() {
		return generateDynamicDependencyLoader;
	}
});
Object.defineProperty(exports, "generateImportMapScript", {
	enumerable: true,
	get: function() {
		return generateImportMapScript;
	}
});
Object.defineProperty(exports, "transformDepsToEsmLinks", {
	enumerable: true,
	get: function() {
		return transformDepsToEsmLinks;
	}
});

//# sourceMappingURL=constant-BiTHay51.cjs.map