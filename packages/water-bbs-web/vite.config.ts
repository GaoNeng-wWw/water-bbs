import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'vue-router/vite';
import UnoCSS from 'unocss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    VueRouter({
      dts: './types/typed-router.d.ts',
    }),
    vue(),
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components/'),
      '@': resolve(__dirname, './src/'),
    },
  },
});
