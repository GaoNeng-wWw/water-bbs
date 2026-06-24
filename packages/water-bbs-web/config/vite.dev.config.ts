import { defineConfig } from 'vite';
import viteBaseConfig, { plugins } from './vite.base.config';
import { join } from 'path';
import { heyApiPlugin } from '@hey-api/vite-plugin';

export default defineConfig({
  ...viteBaseConfig,
  plugins: [
    ...plugins,
    heyApiPlugin({
      config: {
        input: 'http://localhost:8848/api-json',
        output: {
          path: join(__dirname, '../src/api'),
        },
        plugins: [
          {
            name: '@hey-api/client-axios',
            baseUrl: '/api',
          },
          '@hey-api/schemas',
          {
            dates: true,
            name: '@hey-api/transformers',
          },
          {
            enums: 'javascript',
            name: '@hey-api/typescript',
          },
          {
            name: '@hey-api/sdk',
            transformer: true,
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8848/',
        changeOrigin: true,
        rewrite: (path: string) => {
          return path.replace(/^\/api/, '');
        },
      },
    },
  },
});
