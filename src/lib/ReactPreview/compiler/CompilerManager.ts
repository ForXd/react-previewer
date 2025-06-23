import type { CompilerStrategy, CompilerType, CompilerOptions, TransformOptions, CompileResult, CompilePerformance } from './types';
import { BabelStrategy, SwcStrategy } from './strategies';
import { createModuleLogger } from '../preview/utils/Logger';

const logger = createModuleLogger('CompilerManager');

export interface CompilerComparison {
  babel?: CompilePerformance;
  swc?: CompilePerformance;
  winner?: CompilerType;
  speedup?: number; // SWC 相对于 Babel 的速度提升倍数
}

export class CompilerManager {
  private strategies = new Map<CompilerType, CompilerStrategy>();
  private defaultStrategy: CompilerType = 'babel';
  private initialized = false;

  constructor() {
    this.registerStrategies();
  }

  private registerStrategies(): void {
    // 注册 Babel 策略
    this.strategies.set('babel', new BabelStrategy());
    
    // 注册 SWC 策略
    this.strategies.set('swc', new SwcStrategy());
  }

  async initialize(strategy?: CompilerType): Promise<void> {
    if (this.initialized) return;

    const targetStrategy = strategy || this.defaultStrategy;
    const compiler = this.strategies.get(targetStrategy);

    if (!compiler) {
      throw new Error(`Compiler strategy '${targetStrategy}' not found`);
    }

    try {
      await compiler.initialize();
      this.defaultStrategy = targetStrategy;
      this.initialized = true;
      logger.info(`Initialized compiler with strategy: ${targetStrategy}`);
    } catch (error) {
      logger.error(`Failed to initialize compiler strategy '${targetStrategy}':`, error);
      
      // 如果指定策略失败，尝试回退到 Babel
      if (strategy && strategy !== 'babel') {
        logger.info('Falling back to Babel strategy');
        await this.initialize('babel');
      } else {
        throw error;
      }
    }
  }

  async transform(code: string, options: TransformOptions): Promise<string> {
    if (!this.initialized) {
      throw new Error('CompilerManager not initialized');
    }

    const strategy = options.compiler || this.defaultStrategy;
    const compiler = this.strategies.get(strategy);

    if (!compiler) {
      throw new Error(`Compiler strategy '${strategy}' not found`);
    }

    if (!compiler.isSupported(options.filename || '')) {
      logger.warn(`File type not supported by ${strategy}: ${options.filename}`);
      return code; // 返回原始代码
    }

    return await compiler.transform(code, options);
  }

  async transformWithPerformance(code: string, options: TransformOptions): Promise<CompileResult> {
    if (!this.initialized) {
      throw new Error('CompilerManager not initialized');
    }

    const strategy = options.compiler || this.defaultStrategy;
    const compiler = this.strategies.get(strategy);

    if (!compiler) {
      throw new Error(`Compiler strategy '${strategy}' not found`);
    }

    if (!compiler.isSupported(options.filename || '')) {
      logger.warn(`File type not supported by ${strategy}: ${options.filename}`);
      return { code }; // 返回原始代码
    }

    // 检查是否有 transformWithPerformance 方法
    if ('transformWithPerformance' in compiler && typeof (compiler as any).transformWithPerformance === 'function') {
      return await (compiler as any).transformWithPerformance(code, options);
    }

    // 如果没有性能测量方法，使用普通方法
    const result = await compiler.transform(code, options);
    return { code: result };
  }

  async compareCompilers(code: string, options: TransformOptions): Promise<CompilerComparison> {
    const comparison: CompilerComparison = {};
    
    try {
      // 确保两个编译器都被初始化
      const babelStrategy = this.strategies.get('babel') as BabelStrategy;
      const swcStrategy = this.strategies.get('swc') as SwcStrategy;
      
      if (!babelStrategy || !swcStrategy) {
        throw new Error('Compiler strategies not found');
      }

      // 初始化 Babel（如果还没初始化）
      if (!babelStrategy.initialized) {
        await babelStrategy.initialize();
      }

      // 初始化 SWC（如果还没初始化）
      if (!swcStrategy.initialized) {
        await swcStrategy.initialize();
      }

      // 测试 Babel
      try {
        const babelResult = await babelStrategy.transformWithPerformance(code, { ...options, compiler: 'babel' });
        if (babelResult.performance) {
          comparison.babel = babelResult.performance;
          logger.info('Babel compilation completed:', babelResult.performance);
        }
      } catch (error) {
        logger.warn('Babel compilation failed during comparison:', error);
      }

      // 测试 SWC
      try {
        const swcResult = await swcStrategy.transformWithPerformance(code, { ...options, compiler: 'swc' });
        if (swcResult.performance) {
          comparison.swc = swcResult.performance;
          logger.info('SWC compilation completed:', swcResult.performance);
        }
      } catch (error) {
        logger.warn('SWC compilation failed during comparison:', error);
      }

      // 计算胜者和速度提升
      if (comparison.babel && comparison.swc) {
        if (comparison.swc.duration < comparison.babel.duration) {
          comparison.winner = 'swc';
          comparison.speedup = comparison.babel.duration / comparison.swc.duration;
        } else {
          comparison.winner = 'babel';
          comparison.speedup = comparison.swc.duration / comparison.babel.duration;
        }
      } else if (comparison.babel) {
        comparison.winner = 'babel';
      } else if (comparison.swc) {
        comparison.winner = 'swc';
      }

      logger.info('Compiler comparison completed:', comparison);
      return comparison;
    } catch (error) {
      logger.error('Failed to compare compilers:', error);
      throw error;
    }
  }

  setDefaultStrategy(strategy: CompilerType): void {
    if (!this.strategies.has(strategy)) {
      throw new Error(`Compiler strategy '${strategy}' not found`);
    }
    this.defaultStrategy = strategy;
    logger.info(`Default compiler strategy set to: ${strategy}`);
  }

  getAvailableStrategies(): CompilerType[] {
    return Array.from(this.strategies.keys());
  }

  isStrategyAvailable(strategy: CompilerType): boolean {
    return this.strategies.has(strategy);
  }

  configureStrategy(strategy: CompilerType, options: CompilerOptions): void {
    const compiler = this.strategies.get(strategy);
    if (!compiler) {
      throw new Error(`Compiler strategy '${strategy}' not found`);
    }

    // 重新创建策略实例以应用新配置
    if (strategy === 'babel') {
      this.strategies.set(strategy, new BabelStrategy(options));
    } else if (strategy === 'swc') {
      this.strategies.set(strategy, new SwcStrategy(options));
    }

    logger.info(`Configured ${strategy} strategy with new options`);
  }
} 