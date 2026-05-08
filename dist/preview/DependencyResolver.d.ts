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
declare function parsePackagePath(packagePath: string): {
    packageName: string;
    subPath: string;
};
/**
 * 将依赖信息转换为 esm.sh 链接
 * @param depsInfo 依赖信息对象
 * @param options ESM.sh 配置选项
 * @returns 转换结果
 */
declare function transformDepsToEsmLinks(depsInfo: DepsInfo, options?: EsmOptions): TransformResult;
/**
 * 生成 HTML 中的 import map 脚本标签
 * @param importMap 导入映射
 * @returns HTML 脚本标签字符串
 */
declare function generateImportMapScript(importMap: Record<string, string>): string;
/**
 * 生成动态依赖加载脚本
 * @param depsInfo 依赖信息
 * @param options ESM.sh 配置选项
 * @returns 动态加载脚本字符串
 */
declare function generateDynamicDependencyLoader(depsInfo: DepsInfo, options?: EsmOptions, styleResources?: Array<{
    name: string;
    url: string;
}>): string;
export { transformDepsToEsmLinks, generateImportMapScript, generateDynamicDependencyLoader, parsePackagePath, type DepsInfo, type EsmOptions, type TransformResult };
//# sourceMappingURL=DependencyResolver.d.ts.map