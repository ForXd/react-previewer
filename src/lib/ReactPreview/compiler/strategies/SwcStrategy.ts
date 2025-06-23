import type { CompilerStrategy, TransformOptions, CompilerOptions, CompileResult, CompilePerformance } from '../types';
import { createModuleLogger } from '../../preview/utils/Logger';

const logger = createModuleLogger('SwcStrategy');

export class SwcStrategy implements CompilerStrategy {
  name = 'swc' as const;
  public initialized = false;
  private swc: any;
  private options: CompilerOptions;

  constructor(options: CompilerOptions = {}) {
    this.options = {
      target: 'es2020',
      jsx: 'react-jsx',
      typescript: true,
      minify: false,
      sourceMaps: false,
      ...options
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // 动态导入 @swc/wasm-web,必须这样写，否则会报错
      // @ts-ignore
      const initSwc = await import('@swc/wasm-web?init');
      this.swc = initSwc.transform;
      
      // 初始化 SWC
      await initSwc.default();
      
      logger.info('SWC strategy initialized');
      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize SWC strategy:', error);
      throw error;
    }
  }

  async transform(code: string, options: TransformOptions): Promise<string> {
    if (!this.initialized) {
      throw new Error('SWC strategy not initialized');
    }

    const startTime = performance.now();

    try {
      const swcOptions = {
        jsc: {
          parser: {
            syntax: this.options.typescript ? 'typescript' : 'ecmascript',
            tsx: this.options.typescript,
            jsx: !this.options.typescript,
            decorators: false,
            dynamicImport: true
          },
          transform: {
            react: {
              runtime: this.options.jsx === 'react-jsx' ? 'automatic' : 'classic',
              development: false,
              refresh: false
            }
          },
          target: this.options.target
        },
        module: {
          type: 'es6'
        },
        minify: this.options.minify,
        sourceMaps: this.options.sourceMaps,
        filename: options.filename
      };

      const result = await this.swc(code, swcOptions);
      
      if (!result.code) {
        throw new Error('SWC transformation failed: no output code');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const fileSize = new Blob([result.code]).size;

      logger.debug(`SWC transformed: ${options.filename} in ${duration.toFixed(2)}ms, size: ${fileSize} bytes`);
      return result.code;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.error(`SWC transformation failed for ${options.filename} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  async transformWithPerformance(code: string, options: TransformOptions): Promise<CompileResult> {
    if (!this.initialized) {
      throw new Error('SWC strategy not initialized');
    }

    const startTime = performance.now();

    try {
      const swcOptions = {
        jsc: {
          parser: {
            syntax: this.options.typescript ? 'typescript' : 'ecmascript',
            tsx: this.options.typescript,
            jsx: !this.options.typescript,
            decorators: false,
            dynamicImport: true
          },
          transform: {
            react: {
              runtime: this.options.jsx === 'react-jsx' ? 'automatic' : 'classic',
              development: false,
              refresh: false
            }
          },
          target: this.options.target
        },
        module: {
          type: 'es6'
        },
        minify: this.options.minify,
        sourceMaps: this.options.sourceMaps,
        filename: options.filename
      };

      const result = await this.swc(code, swcOptions);
      
      if (!result.code) {
        throw new Error('SWC transformation failed: no output code');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const fileSize = new Blob([result.code]).size;

      const perfData: CompilePerformance = {
        compiler: 'swc',
        duration,
        fileSize,
        timestamp: Date.now()
      };

      logger.debug(`SWC transformed: ${options.filename} in ${duration.toFixed(2)}ms, size: ${fileSize} bytes`);
      
      return {
        code: result.code,
        performance: perfData
      };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.error(`SWC transformation failed for ${options.filename} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  isSupported(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['js', 'jsx', 'ts', 'tsx'].includes(ext || '');
  }
} 