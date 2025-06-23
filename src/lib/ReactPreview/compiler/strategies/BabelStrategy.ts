import type { CompilerStrategy, TransformOptions, CompilerOptions, CompileResult, CompilePerformance } from '../types';
import { transform } from '@babel/standalone';
import { createModuleLogger } from '../../preview/utils/Logger';

const logger = createModuleLogger('BabelStrategy');

export class BabelStrategy implements CompilerStrategy {
  name = 'babel' as const;
  public initialized = false;
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
      // Babel 是同步加载的，这里主要是验证可用性
      logger.info('Babel strategy initialized');
      this.initialized = true;
    } catch (error) {
      logger.error('Failed to initialize Babel strategy:', error);
      throw error;
    }
  }

  async transform(code: string, options: TransformOptions): Promise<string> {
    if (!this.initialized) {
      throw new Error('Babel strategy not initialized');
    }

    const startTime = performance.now();
    
    try {
      const babelOptions = {
        presets: ['react', 'typescript'],
        plugins: [],
        filename: options.filename,
        sourceMaps: this.options.sourceMaps,
        compact: this.options.minify,
        retainLines: true
      };

      const result = transform(code, babelOptions);
      
      if (!result.code) {
        throw new Error('Babel transformation failed: no output code');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const fileSize = new Blob([result.code]).size;

      logger.debug(`Babel transformed: ${options.filename} in ${duration.toFixed(2)}ms, size: ${fileSize} bytes`);
      
      return result.code;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.error(`Babel transformation failed for ${options.filename} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  async transformWithPerformance(code: string, options: TransformOptions): Promise<CompileResult> {
    if (!this.initialized) {
      throw new Error('Babel strategy not initialized');
    }

    const startTime = performance.now();
    
    try {
      const babelOptions = {
        presets: [
          ['@babel/preset-env', { targets: this.options.target }],
          ['@babel/preset-react', { 
            runtime: this.options.jsx === 'react-jsx' ? 'automatic' : 'classic'
          }],
          ...(this.options.typescript ? [['@babel/preset-typescript', { isTSX: true }]] : [])
        ],
        plugins: [],
        filename: options.filename,
        sourceMaps: this.options.sourceMaps,
        compact: this.options.minify,
        retainLines: true
      };

      const result = transform(code, babelOptions);
      
      if (!result.code) {
        throw new Error('Babel transformation failed: no output code');
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      const fileSize = new Blob([result.code]).size;

      const perfData: CompilePerformance = {
        compiler: 'babel',
        duration,
        fileSize,
        timestamp: Date.now()
      };

      logger.debug(`Babel transformed: ${options.filename} in ${duration.toFixed(2)}ms, size: ${fileSize} bytes`);
      
      return {
        code: result.code,
        performance: perfData
      };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.error(`Babel transformation failed for ${options.filename} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  isSupported(fileName: string): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['js', 'jsx', 'ts', 'tsx'].includes(ext || '');
  }
} 