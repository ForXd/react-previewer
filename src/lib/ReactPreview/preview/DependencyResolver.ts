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
    dev = false,
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

// 导出主要函数
export {
  transformDepsToEsmLinks,
  generateReactEsmConfig,
  batchTransformDeps,
  generateImportMapScript,
  parsePackagePath,
  type DepsInfo,
  type EsmOptions,
  type TransformResult
};