import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'vue-router/vite';
import UnoCSS from 'unocss/vite';
import { join, resolve } from 'path';
import { heyApiPlugin } from '@hey-api/vite-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    VueRouter({
      dts: './types/typed-router.d.ts',
    }),
    vue(),
    // heyApiPlugin({
    //   config: {
    //     input: 'http://localhost:3100/api-json',
    //     output: {
    //       path: join(__dirname, './src/api'),
    //     },
    //     plugins: [
    //       {
    //         name: '@hey-api/client-axios',
    //         baseUrl: '/api',
    //       },
    //       '@hey-api/schemas',
    //       {
    //         dates: true,
    //         name: '@hey-api/transformers',
    //       },
    //       {
    //         enums: 'javascript',
    //         name: '@hey-api/typescript',
    //       },
    //       {
    //         name: '@hey-api/sdk',
    //         transformer: true,
    //       },
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@components': resolve(__dirname, './src/components/'),
      '@': resolve(__dirname, './src/'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8848/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
