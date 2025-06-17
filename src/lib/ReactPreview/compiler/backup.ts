// import type { JSXOpeningElement, ImportDeclaration, JSXAttribute } from '@swc/types';

// interface TransformOptions {
//   filename?: string;
//   files?: Record<string, string>;
//   depsInfo?: Record<string, string>;
//   fileUrls?: Map<string, string>;
// }

// type FileSystem = Record<string, string>;

// /**
//  * 依赖图节点
//  */
// interface DependencyNode {
//   fileName: string;
//   dependencies: Set<string>; // 依赖的文件
//   dependents: Set<string>;   // 依赖此文件的文件
//   processed: boolean;
// }

// /**
//  * 依赖图
//  */
// class DependencyGraph {
//   private nodes = new Map<string, DependencyNode>();

//   addFile(fileName: string): void {
//     if (!this.nodes.has(fileName)) {
//       this.nodes.set(fileName, {
//         fileName,
//         dependencies: new Set(),
//         dependents: new Set(),
//         processed: false
//       });
//     }
//   }

//   addDependency(from: string, to: string): void {
//     this.addFile(from);
//     this.addFile(to);
    
//     const fromNode = this.nodes.get(from)!;
//     const toNode = this.nodes.get(to)!;
    
//     fromNode.dependencies.add(to);
//     toNode.dependents.add(from);
//   }

//   /**
//    * 拓扑排序，返回处理顺序
//    */
//   getProcessingOrder(): string[] {
//     const result: string[] = [];
//     const visited = new Set<string>();
//     const visiting = new Set<string>();

//     const visit = (fileName: string): void => {
//       if (visited.has(fileName)) return;
//       if (visiting.has(fileName)) {
//         console.warn(`Circular dependency detected involving: ${fileName}`);
//         return;
//       }

//       visiting.add(fileName);
//       const node = this.nodes.get(fileName);
      
//       if (node) {
//         // 先处理所有依赖
//         for (const dep of node.dependencies) {
//           visit(dep);
//         }
//       }

//       visiting.delete(fileName);
//       visited.add(fileName);
//       result.push(fileName);
//     };

//     // 首先处理 CSS 文件（它们通常没有依赖）
//     const cssFiles = Array.from(this.nodes.keys()).filter(f => f.endsWith('.css'));
//     const otherFiles = Array.from(this.nodes.keys()).filter(f => !f.endsWith('.css'));

//     // 先访问 CSS 文件
//     for (const fileName of cssFiles) {
//       visit(fileName);
//     }

//     // 再访问其他文件
//     for (const fileName of otherFiles) {
//       visit(fileName);
//     }

//     return result;
//   }

//   getNode(fileName: string): DependencyNode | undefined {
//     return this.nodes.get(fileName);
//   }

//   getAllFiles(): string[] {
//     return Array.from(this.nodes.keys());
//   }
// }

// /**
//  * 创建 JSX 属性
//  */
// function createJSXAttribute(name: string, value: string): JSXAttribute {
//   return {
//     type: 'JSXAttribute',
//     span: { start: 0, end: 0, ctxt: 0 },
//     name: {
//       type: 'Identifier',
//       span: { start: 0, end: 0, ctxt: 0 },
//       value: name,
//       optional: false,
//     },
//     value: {
//       type: 'StringLiteral',
//       span: { start: 0, end: 0, ctxt: 0 },
//       value,
//       raw: `"${value}"`,
//     },
//   };
// }

// /**
//  * 检查是否已存在指定属性
//  */
// function hasAttribute(attributes: (JSXAttribute | any)[], attrName: string): boolean {
//   return attributes.some(
//     (attr) =>
//       attr.type === 'JSXAttribute' && attr.name?.type === 'Identifier' && attr.name?.value === attrName,
//   );
// }

// /**
//  * 从源码和字节偏移计算行号
//  */
// function calculateLineNumber(source: string, byteOffset: number): number {
//   const lines = source.substring(0, byteOffset).split('\n');
//   return lines.length;
// }

// /**
//  * 解析相对路径
//  */
// function resolveRelativePath(currentFile: string, importPath: string): string {
//   // 移除开头的 './'
//   if (importPath.startsWith('./')) {
//     const currentDir = currentFile.split('/').slice(0, -1).join('/');
//     const relativePath = importPath.slice(2);
//     return currentDir ? `${currentDir}/${relativePath}` : relativePath;
//   }
  
//   // 处理 '../' 
//   if (importPath.startsWith('../')) {
//     const currentDir = currentFile.split('/').slice(0, -1);
//     const parts = importPath.split('/');
//     let upCount = 0;
    
//     for (const part of parts) {
//       if (part === '..') {
//         upCount++;
//       } else {
//         break;
//       }
//     }
    
//     const targetDir = currentDir.slice(0, Math.max(0, currentDir.length - upCount));
//     const remainingPath = parts.slice(upCount).join('/');
//     return targetDir.length > 0 ? `${targetDir.join('/')}/${remainingPath}` : remainingPath;
//   }
  
//   return importPath;
// }

// /**
//  * 获取文件名（处理扩展名）
//  */
// function getResolvedFilename(filename: string, files: Record<string, string> = {}): string {
//   const extensions = ['', '.tsx', '.ts', '.jsx', '.js', '.css'];

//   for (const ext of extensions) {
//     const testFilename = `${filename}${ext}`;
//     if (files[testFilename]) {
//       return testFilename;
//     }
//   }

//   return filename;
// }

// /**
//  * CSS 转 JS
//  */
// async function css2Js(path: string, contents: string): Promise<string> {
//   return `
//     const style = document.createElement('style');
//     style.setAttribute('data-path', '${path}');
//     style.innerHTML = ${JSON.stringify(contents)};
//     document.head.appendChild(style);
//   `;
// }

// /**
//  * 分析文件的依赖关系
//  */
// async function analyzeDependencies(content: string, fileName: string, files: Record<string, string>): Promise<string[]> {
//   try {
//     const initSwc = await import('@swc/wasm-web');
    
//     const ast = await initSwc.parse(content, {
//       syntax: 'typescript',
//       tsx: true,
//       decorators: true,
//       dynamicImport: true,
//     });

//     const dependencies: string[] = [];

//     function traverse(node: any): void {
//       if (!node || typeof node !== 'object') return;

//       if (node.type === 'ImportDeclaration') {
//         const moduleName = node.source?.value;
//         if (moduleName && moduleName.startsWith('.')) {
//           // 解析相对路径
//           const resolvedPath = resolveRelativePath(fileName, moduleName);
//           const finalPath = getResolvedFilename(resolvedPath, files);
//           if (files[finalPath]) {
//             dependencies.push(finalPath);
//           }
//         }
//       }

//       // 递归遍历
//       for (const key in node) {
//         if (node.hasOwnProperty(key)) {
//           const value = node[key];
//           if (Array.isArray(value)) {
//             value.forEach(traverse);
//           } else if (typeof value === 'object' && value !== null) {
//             traverse(value);
//           }
//         }
//       }
//     }

//     traverse(ast);
//     return dependencies;
//   } catch (error) {
//     console.warn(`Failed to analyze dependencies for ${fileName}:`, error);
//     return [];
//   }
// }

// /**
//  * 构建依赖图
//  */
// async function buildDependencyGraph(files: Record<string, string>): Promise<DependencyGraph> {
//   const graph = new DependencyGraph();

//   // 添加所有文件到图中
//   for (const fileName of Object.keys(files)) {
//     graph.addFile(fileName);
//   }

//   // 分析每个文件的依赖关系
//   for (const [fileName, content] of Object.entries(files)) {
//     if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
//       const dependencies = await analyzeDependencies(content, fileName, files);
//       for (const dep of dependencies) {
//         graph.addDependency(fileName, dep);
//       }
//     }
//   }

//   return graph;
// }

// /**
//  * 处理 JSX 开始标签，添加调试信息
//  */
// function processJSXOpeningElement(node: JSXOpeningElement, source: string, options: TransformOptions): void {
//   const { filename, files } = options;

//   if (!node.span) return;

//   const line = calculateLineNumber(source, node.span.start);

//   if (!node.attributes) {
//     node.attributes = [];
//   }

//   if (!hasAttribute(node.attributes, 'data-line')) {
//     const lineAttr = createJSXAttribute('data-line', line.toString());
//     node.attributes.push(lineAttr);
//   }

//   if (!hasAttribute(node.attributes, 'data-file') && filename) {
//     const resolvedFilename = getResolvedFilename(filename, files);
//     const fileAttr = createJSXAttribute('data-file', resolvedFilename);
//     node.attributes.push(fileAttr);
//   }
// }

// /**
//  * 实现 import 内容转换
//  */
// function processImportDeclaration(node: ImportDeclaration, source: string, options: TransformOptions) {
//   const { filename, files, fileUrls, depsInfo } = options;

//   const moduleName = node.source.value;

//   if (!moduleName || !filename) return;

//   // 处理相对路径导入
//   if (moduleName.startsWith('.')) {
//     const resolvedPath = resolveRelativePath(filename, moduleName);
//     const finalPath = getResolvedFilename(resolvedPath, files);

//     console.log("moduleName: =======", moduleName, resolvedPath, finalPath)
    
//     const url = fileUrls?.get(finalPath);
//     if (url) {
//       node.source.raw = `'${url}'`;
//       console.log('Resolved local import:', finalPath, '-> URL:', url);
//     } else {
//       console.warn('URL not found for local file:', finalPath);
//     }
//   }
//   // 处理三方依赖导入
//   else {
//     const esmUrl = depsInfo?.[moduleName] || moduleName;
//     node.source.raw = `'${esmUrl}'`;
//     console.log('Resolved external import:', moduleName, '-> ESM URL:', esmUrl);
//   }
// }

// /**
//  * 递归遍历并修改 AST 节点
//  */
// function traverseAndModifyAST(node: any, source: string, options: TransformOptions): void {
//   if (!node || typeof node !== 'object') return;

//   if (node.type === 'JSXOpeningElement') {
//     processJSXOpeningElement(node, source, options);
//   } else if (node.type === 'ImportDeclaration') {
//     processImportDeclaration(node, source, options);
//   }

//   for (const key in node) {
//     if (node.hasOwnProperty(key)) {
//       const value = node[key];
//       if (Array.isArray(value)) {
//         value.forEach((item) => traverseAndModifyAST(item, source, options));
//       } else if (typeof value === 'object' && value !== null) {
//         traverseAndModifyAST(value, source, options);
//       }
//     }
//   }
// }

// export class CodeTransformer {
//   private initialized = false;

//   async initialize(): Promise<void> {
//     if (this.initialized) return;

//     const wasmUrl = new URL('@swc/wasm-web/wasm_bg.wasm', import.meta.url);
//     const initSwc = (await import('@swc/wasm-web')).default;
    
//     console.log('Initializing SWC...');
//     await initSwc(wasmUrl);
//     this.initialized = true;
//   }

//   async transformFiles(files: FileSystem, depsInfo: Record<string, string>): Promise<Map<string, string>> {
//     if (!this.initialized) {
//       throw new Error('CodeTransformer not initialized');
//     }

//     console.log('Building dependency graph...');
    
//     // 第一步：构建依赖图
//     const dependencyGraph = await buildDependencyGraph(files);
    
//     // 第二步：获取处理顺序（拓扑排序）
//     const processingOrder = dependencyGraph.getProcessingOrder();
//     console.log('Processing order:', processingOrder);

//     // 第三步：预处理 CSS 文件
//     const preprocessedFiles = new Map<string, string>();
//     for (const [fileName, fileContent] of Object.entries(files)) {
//       if (fileName.endsWith('.css')) {
//         const jsContent = await css2Js(fileName, fileContent);
//         preprocessedFiles.set(fileName, jsContent);
//       } else {
//         preprocessedFiles.set(fileName, fileContent);
//       }
//     }

//     // 第四步：按依赖顺序处理文件
//     const transformedFiles = new Map<string, string>();
//     const fileUrls = new Map<string, string>();
//     console.log('fileUrls is: ', fileUrls)

//     for (const fileName of processingOrder) {
//       const fileContent = preprocessedFiles.get(fileName) || files[fileName];
      
//       if (!fileContent) {
//         console.warn(`File not found: ${fileName}`);
//         continue;
//       }

//       let processedContent = fileContent;

//       // 如果需要转换，则进行转换
//       if (this.shouldTransform(fileName)) {
//         try {
//           processedContent = await this.transformFile(fileContent, fileName, {
//             filename: fileName,
//             files: Object.fromEntries(preprocessedFiles),
//             fileUrls,
//             depsInfo
//           });
//         } catch (error) {
//           console.error(`Failed to transform ${fileName}:`, error);
//           // 转换失败时使用原始内容
//         }
//       }

//       // 保存转换后的内容
//       transformedFiles.set(fileName, processedContent);

//       // 生成 blob URL
//       const blob = new Blob([processedContent], { 
//         type: 'application/javascript' 
//       });
//       const url = URL.createObjectURL(blob);
//       fileUrls.set(fileName, url);

//       console.log(`Processed: ${fileName} -> ${url}`);
//     }

//     return transformedFiles;
//   }

//   private shouldTransform(fileName: string): boolean {
//     const ext = fileName.split('.').pop()?.toLowerCase();
//     return ['ts', 'tsx', 'jsx'].includes(ext || '');
//   }

//   private async transformFile(content: string, fileName: string, options: TransformOptions): Promise<string> {
//     try {
//       const initSwc = await import('@swc/wasm-web');

//       // 解析为 AST
//       const ast = await initSwc.parse(content, {
//         syntax: 'typescript',
//         tsx: true,
//         decorators: true,
//         dynamicImport: true,
//       });

//       // 遍历并修改 AST
//       traverseAndModifyAST(ast, content, options);

//       // 将修改后的 AST 打印回代码
//       const modifiedCode = await initSwc.print(ast, {
//         minify: false,
//       });

//       // 转换代码
//       const result = await initSwc.transform(modifiedCode.code, {
//         filename: fileName,
//         jsc: {
//           parser: {
//             syntax: fileName.endsWith('.ts') || fileName.endsWith('.tsx') ? 'typescript' : 'ecmascript',
//             tsx: fileName.endsWith('.tsx') || fileName.endsWith('.jsx'),
//             decorators: true,
//           },
//           transform: {
//             react: {
//               runtime: 'automatic',
//               importSource: 'https://esm.sh/react@18.2.0',
//             },
//           },
//           target: 'es2020',
//         },
//         module: {
//           type: 'es6',
//         },
//       });

//       return result.code;
//     } catch (error) {
//       throw new Error(`Failed to transform ${fileName}: ${error}`);
//     }
//   }

//   /**
//    * 清理生成的 blob URLs
//    */
//   cleanup(transformedFiles: Map<string, string>): void {
//     // 这里可以根据需要实现清理逻辑
//     console.log('Cleanup completed');
//   }
// }