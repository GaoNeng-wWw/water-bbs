import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'vue-router/vite';
import UnoCSS from 'unocss/vite';
import { resolve } from 'path';

export const plugins = [
  UnoCSS(),
  VueRouter({
    dts: '../types/typed-router.d.ts',
  }),
  vue(),
];

export default {
  plugins,
  resolve: {
    alias: {
      '@components': resolve(__dirname, '../src/components/'),
      '@': resolve(__dirname, '../src/'),
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      errorRecovery: true,
    },
  },
} as const;
