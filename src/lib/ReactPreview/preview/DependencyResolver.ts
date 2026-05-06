/**
 * 依赖信息接口
 */
interface DepsInfo {
  [packageName: string]: string;
}

/**
 * ESM.sh 配置选项
 */
interface EsmOptions {
  /** 是否使用开发模式 */
  dev?: boolean;
  /** 目标环境 */
  target?: string;
  /** 是否启用 bundle 模式 */
  bundle?: boolean;
  /** 外部依赖 */
  external?: string[];
  /** 别名映射 */
  alias?: Record<string, string>;
  /** 是否保持符号链接 */
  keepNames?: boolean;
}

/**
 * 转换结果接口
 */
interface TransformResult {
  /** 转换后的依赖映射 */
  dependencies: Record<string, string>;
  /** 导入映射 */
  importMap: {
    imports: Record<string, string>;
  };
}

/**
 * 解析包名和子路径
 * @param packagePath 完整的包路径
 * @returns 解析后的包名和子路径
 */
function parsePackagePath(packagePath: string): { packageName: string; subPath: string } {
  // 处理 scoped package (以 @ 开头)
  if (packagePath.startsWith('@')) {
    const parts = packagePath.split('/');
    if (parts.length >= 2) {
      const packageName = `${parts[0]}/${parts[1]}`;
      const subPath = parts.slice(2).join('/');
      return { packageName, subPath };
    }
    return { packageName: packagePath, subPath: '' };
  }
  
  // 处理普通包
  const firstSlashIndex = packagePath.indexOf('/');
  if (firstSlashIndex === -1) {
    return { packageName: packagePath, subPath: '' };
  }
  
  const packageName = packagePath.substring(0, firstSlashIndex);
  const subPath = packagePath.substring(firstSlashIndex + 1);
  return { packageName, subPath };
}

/**
 * 将依赖信息转换为 esm.sh 链接
 * @param depsInfo 依赖信息对象
 * @param options ESM.sh 配置选项
 * @returns 转换结果
 */
function transformDepsToEsmLinks(
  depsInfo: DepsInfo,
  options: EsmOptions = {}
): TransformResult {
  const {
    target = 'es2022',
    bundle = false,
    external = [],
    alias = {},
    keepNames = false
  } = options;

  const dependencies: Record<string, string> = {};
  const imports: Record<string, string> = {};

  // 处理每个依赖
  Object.entries(depsInfo).forEach(([packagePath, version]) => {
    // 解析包名和子路径
    const { packageName, subPath } = parsePackagePath(packagePath);
    
    // 处理别名
    const actualPackageName = alias[packageName] || packageName;
    
    // 构建基础 URL
    let esmUrl = `https://esm.sh/${actualPackageName}@${version}`;
    
    // 添加子路径
    if (subPath) {
      esmUrl += `/${subPath}`;
    }
    
    // 添加查询参数
    const params = new URLSearchParams();
    
    // if (dev) {
    //   params.append('dev', '');
    // }
    
    if (target) {
      params.append('target', target);
    }
    
    if (bundle) {
      params.append('bundle', '');
    }
    
    if (external.length > 0 && packageName !== 'react') {
      params.append('external', external.join(','));
    }
    
    if (keepNames) {
      params.append('keep-names', '');
    }
    
    // 添加参数到 URL
    const queryString = params.toString();
    if (queryString) {
      esmUrl += `?${queryString}`;
    }
    
    dependencies[packagePath] = esmUrl;
    imports[packagePath] = esmUrl;
  });

  return {
    dependencies,
    importMap: {
      imports
    }
  };
}

/**
 * 生成 React 项目的 ESM 依赖配置
 * @param depsInfo 依赖信息
 * @returns 转换结果
 */
function generateReactEsmConfig(depsInfo: DepsInfo): TransformResult {
  // React 项目的特殊处理
  const reactExternal = ['react', 'react-dom'];
  
  return transformDepsToEsmLinks(depsInfo, {
    target: 'es2022',
    dev: true, // 开启 dev 模式
    external: reactExternal
  });
}

/**
 * 批量处理多个依赖配置
 * @param configs 多个依赖配置
 * @returns 合并后的转换结果
 */
function batchTransformDeps(
  configs: Array<{ deps: DepsInfo; options?: EsmOptions }>
): TransformResult {
  const allDependencies: Record<string, string> = {};
  const allImports: Record<string, string> = {};

  configs.forEach(({ deps, options }) => {
    const result = transformDepsToEsmLinks(deps, options);
    Object.assign(allDependencies, result.dependencies);
    Object.assign(allImports, result.importMap.imports);
  });

  return {
    dependencies: allDependencies,
    importMap: {
      imports: allImports
    }
  };
}

/**
 * 生成 HTML 中的 import map 脚本标签
 * @param importMap 导入映射
 * @returns HTML 脚本标签字符串
 */
function generateImportMapScript(importMap: Record<string, string>): string {
  return `<script type="importmap">
${JSON.stringify({ imports: importMap }, null, 2)}
</script>`;
}

/**
 * 生成动态依赖加载脚本
 * @param depsInfo 依赖信息
 * @param options ESM.sh 配置选项
 * @returns 动态加载脚本字符串
 */
function generateDynamicDependencyLoader(
  depsInfo: DepsInfo,
  options: EsmOptions = {},
  styleResources: Array<{ name: string; url: string }> = []
): string {
  const result = transformDepsToEsmLinks(depsInfo, options);
  const dependencies = result.dependencies;
  
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
    const tailwindResource = { name: 'tailwindcss', url: 'https://cdn.tailwindcss.com' };
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
          console.log(\`✅ 依赖 \${name} 命中缓存 (\${loadTime}ms)\`);
        } else {
          dynamicDependencyLoader.setDependencyStatus(name, 'loaded');
          console.log(\`✅ 依赖 \${name} 加载成功 (\${loadTime}ms)\`);
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
      console.log('所有依赖加载完成');
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    }).catch(error => {
      console.error('依赖加载过程中出现错误:', error);
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    });
  `;
}

// 导出主要函数
export {
  transformDepsToEsmLinks,
  generateReactEsmConfig,
  batchTransformDeps,
  generateImportMapScript,
  generateDynamicDependencyLoader,
  parsePackagePath,
  type DepsInfo,
  type EsmOptions,
  type TransformResult
};
