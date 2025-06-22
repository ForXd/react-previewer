
/**
 * 创建 JSX 属性
 */
export function createJSXAttribute(name: string, value: string): any {
  return {
    type: 'JSXAttribute',
    name: {
      type: 'JSXIdentifier',
      name: name
    },
    value: {
      type: 'StringLiteral',
      value: value
    }
  };
}

/**
 * 检查是否已存在指定属性
 */
export function hasAttribute(attributes: any[], attrName: string): boolean {
  return attributes.some(
    (attr) =>
      attr.type === 'JSXAttribute' && 
      attr.name?.type === 'JSXIdentifier' && 
      attr.name?.name === attrName,
  );
}


/**
 * 解析相对路径
 */
export function resolveRelativePath(currentFile: string, importPath: string): string {
  // 如果不是相对路径，直接返回
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) {
    return importPath;
  }

  // 获取当前文件的目录部分
  const currentDir = currentFile.split('/').slice(0, -1);
  
  // 将导入路径按 '/' 分割
  const importParts = importPath.split('/');
  
  // 从当前目录开始构建结果路径
  const resultParts = [...currentDir];
  
  for (const part of importParts) {
    if (part === '.' || part === '') {
      // 忽略当前目录标识符和空字符串
      continue;
    } else if (part === '..') {
      // 向上一级目录
      if (resultParts.length > 0) {
        resultParts.pop();
      }
      // 如果已经到根目录，忽略多余的 '..'
    } else {
      // 普通目录或文件名
      resultParts.push(part);
    }
  }
  
  return resultParts.join('/');
}

/**
 * 获取文件名（处理扩展名）
 */
export function getResolvedFilename(filename: string, files: Record<string, string> = {}): string {
  const extensions = ['', '.tsx', '.ts', '.jsx', '.js', '.css'];

  for (const ext of extensions) {
    const testFilename = `${filename}${ext}`;
    if (files[testFilename]) {
      return testFilename;
    }
  }

  return filename;
}