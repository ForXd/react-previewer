import { describe, expect, it } from 'vitest';
import viteConfig from '../vite.config';

describe('demo page Vite config', () => {
  it('uses same-origin relative assets for production builds', () => {
    const config = typeof viteConfig === 'function'
      ? viteConfig({ command: 'build', mode: 'production' })
      : viteConfig;

    expect(config.base).toBe('./');
  });
});
