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
      '@app/configure': resolve(__dirname, 'libs/shared/src'),
      '@app/shared': resolve(__dirname, 'libs/shared/src'),
    },
  },
});
