import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import { join, resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    swc.vite({
      module: {
        type: 'es6',
      },
    }),
  ],

  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },

  test: {
    globals: true,

    include: ['**/*.e2e-spec.ts'],
    root: resolve(__dirname, '..'),

    testTimeout: 30000,

    hookTimeout: 30000,

    pool: 'forks',
  },
});
