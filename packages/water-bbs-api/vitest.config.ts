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
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@app/configure': resolve(__dirname, 'libs/configure/src'),
      '@app/shared': resolve(__dirname, 'libs/shared/src'),
      '@app/translation': resolve(__dirname, 'libs/translation/src'),
      '@app/configure/*': resolve(__dirname, 'libs/configure/src/*'),
      '@app/shared/*': resolve(__dirname, 'libs/shared/src/*'),
      '@app/notification/*': resolve(__dirname, 'libs/notification/src/*'),
      '@app/verfication-code/*': resolve(
        __dirname,
        'libs/verification-code/src/*',
      ),
      '@app/translation/*': resolve(__dirname, 'libs/translation/src/*'),
    },
  },
});
