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
  options: EsmOptions = {}
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
      loadingStartTime: null,
      showLoadingThreshold: 100, // 100ms 内加载完成不显示加载界面
      
      init() {
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.loadingDetails = document.getElementById('loading-details');
        this.cacheInfo = document.getElementById('cache-info');
        this.cacheRate = document.getElementById('cache-rate');
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
          dep.status = status;
          if (status === 'loaded' || status === 'cached') {
            this.loadedCount++;
          }
          this.updateUI();
        }
      },
      
      updateUI() {
        if (!this.progressFill || !this.progressText) return;
        
        const progress = this.totalCount > 0 ? (this.loadedCount / this.totalCount) * 100 : 0;
        this.progressFill.style.width = progress + '%';
        this.progressText.textContent = Math.round(progress) + '%';
        
        // 计算缓存命中率
        const cachedCount = Array.from(this.dependencies.values()).filter(dep => dep.status === 'cached').length;
        const cacheHitRate = this.totalCount > 0 ? (cachedCount / this.totalCount) * 100 : 0;
        
        // 显示缓存信息
        if (this.cacheInfo && this.cacheRate) {
          if (cachedCount > 0) {
            this.cacheInfo.style.display = 'block';
            this.cacheRate.textContent = Math.round(cacheHitRate) + '%';
          } else {
            this.cacheInfo.style.display = 'none';
          }
        }
        
        // 更新依赖详情
        if (this.loadingDetails) {
          this.loadingDetails.innerHTML = '';
          this.dependencies.forEach((dep, name) => {
            const item = document.createElement('div');
            item.className = 'dependency-item';
            const statusText = dep.status === 'cached' ? '缓存' : this.getStatusText(dep.status);
            const statusClass = dep.status === 'cached' ? 'status-loaded' : \`status-\${dep.status}\`;
            item.innerHTML = \`
              <span class="dependency-name">\${name}</span>
              <span class="dependency-status \${statusClass}">\${statusText}</span>
            \`;
            this.loadingDetails.appendChild(item);
          });
        }
        
        // 检查是否所有依赖都加载完成
        if (this.loadedCount === this.totalCount && this.totalCount > 0) {
          // 检查是否为快速加载
          if (this.checkQuickLoad()) {
            // 快速加载完成，直接隐藏加载界面
            this.hideLoadingOverlay();
            return;
          }
          
          // 添加成功动画
          if (this.loadingOverlay) {
            const loadingContent = this.loadingOverlay.querySelector('.loading-content');
            if (loadingContent) {
              loadingContent.classList.add('completed');
            }
          }
          
          setTimeout(() => {
            this.hideLoadingOverlay();
          }, 800);
        }
      },
      
      getStatusText(status) {
        const statusMap = {
          pending: '等待',
          loading: '加载',
          loaded: '完成',
          cached: '缓存',
          error: '失败'
        };
        return statusMap[status] || status;
      },
      
      showLoadingOverlay() {
        if (this.loadingOverlay) {
          this.loadingOverlay.style.display = 'flex';
          // 强制重排，然后添加动画类
          this.loadingOverlay.offsetHeight;
          this.loadingOverlay.classList.add('showing');
        }
      },
      
      hideLoadingOverlay() {
        if (this.loadingOverlay) {
          this.loadingOverlay.classList.remove('showing');
          this.loadingOverlay.classList.add('hiding');
          setTimeout(() => {
            this.loadingOverlay.style.display = 'none';
            this.loadingOverlay.classList.remove('hiding');
          }, 400);
        }
      },
      
      // 检查是否需要显示加载界面
      shouldShowLoading() {
        if (!this.loadingStartTime) return false;
        const elapsed = Date.now() - this.loadingStartTime;
        
        // 根据网络状况动态调整阈值
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        let threshold = this.showLoadingThreshold;
        
        if (connection) {
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            threshold = 50; // 慢网络降低阈值
          } else if (connection.effectiveType === '4g') {
            threshold = 150; // 快网络提高阈值
          }
        }
        
        return elapsed > threshold;
      },
      
      // 延迟显示加载界面
      scheduleLoadingDisplay() {
        setTimeout(() => {
          if (this.shouldShowLoading()) {
            this.showLoadingOverlay();
          }
        }, this.showLoadingThreshold);
      },
      
      // 检查是否所有依赖都快速加载完成
      checkQuickLoad() {
        const elapsed = Date.now() - this.loadingStartTime;
        const quickLoadThreshold = 200; // 200ms 内完成所有加载认为是快速加载
        
        if (elapsed < quickLoadThreshold && this.loadedCount === this.totalCount) {
          console.log('🚀 所有依赖快速加载完成，跳过加载界面');
          return true;
        }
        return false;
      }
    };
    
    // 初始化动态依赖加载器
    dynamicDependencyLoader.init();
    
    // 添加依赖列表
    const dependencyList = ${JSON.stringify(dependencyList)};
    dynamicDependencyLoader.addDependencies(dependencyList);
    
    // 记录开始时间
    dynamicDependencyLoader.loadingStartTime = Date.now();
    
    // 预加载依赖函数
    async function preloadDependency(name, url) {
      try {
        dynamicDependencyLoader.setDependencyStatus(name, 'loading');
        
        const startTime = Date.now();
        
        // 使用动态导入预加载
        const module = await import(url);
        
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
        
        // 检查是否需要显示加载界面
        if (dynamicDependencyLoader.shouldShowLoading() && !dynamicDependencyLoader.loadingOverlay.classList.contains('showing')) {
          dynamicDependencyLoader.showLoadingOverlay();
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
    
    // 开始预加载所有依赖
    Promise.all(
      dependencyList.map(dep => preloadDependency(dep.name, dep.url))
    ).then(() => {
      console.log('所有依赖加载完成');
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    }).catch(error => {
      console.error('依赖加载过程中出现错误:', error);
      window.dispatchEvent(new CustomEvent('dependencies-ready'));
    });
    
    // 延迟显示加载界面（如果加载时间超过阈值）
    dynamicDependencyLoader.scheduleLoadingDisplay();
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