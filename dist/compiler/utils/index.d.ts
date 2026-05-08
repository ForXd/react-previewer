/**
 * 创建 JSX 属性
 */
export declare function createJSXAttribute(name: string, value: string): {
    type: string;
    name: {
        type: string;
        name: string;
    };
    value: {
        type: string;
        value: string;
    };
};
/**
 * 检查是否已存在指定属性
 */
export declare function hasAttribute(attributes: Array<{
    type: string;
    name?: {
        type: string;
        name: string;
    };
    value?: {
        type: string;
        value: string;
    };
}>, attrName: string): boolean;
/**
 * 解析相对路径
 */
export declare function resolveRelativePath(currentFile: string, importPath: string): string;
/**
 * 获取文件名（处理扩展名）
 */
export declare function getResolvedFilename(filename: string, files?: Record<string, string>): string;
//# sourceMappingURL=index.d.ts.map