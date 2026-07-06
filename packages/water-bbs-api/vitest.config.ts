import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: { transform: { decoratorMetadata: true } },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@app/captcha': resolve(__dirname, 'libs/captcha/src'),
      '@app/configure': resolve(__dirname, 'libs/configure/src'),
      '@app/shared': resolve(__dirname, 'libs/shared/src'),
      '@app/bank': resolve(__dirname, 'libs/bank/src'),
      '@app/gamification': resolve(__dirname, 'libs/gamification/src'),
      '@app/policy': resolve(__dirname, 'libs/policy/src'),
      '@app/storage': resolve(__dirname, 'libs/storage/src'),
      '@app/workflow': resolve(__dirname, 'libs/workflow/src'),
    },
  },
});
