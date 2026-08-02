import { defineConfig, loadEnv } from 'vite';
import { heyApiPlugin } from '@hey-api/vite-plugin';
import { join } from 'path';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      tailwindcss(),
      // heyApiPlugin({
      //   config: {
      //     input: `${env.VITE_API_URL}/api-json`,
      //     output: {
      //       path: join(__dirname, '..', 'src', 'api'),
      //     },
      //     plugins: [
      //       {
      //         name: '@hey-api/client-axios',
      //         baseUrl: env.VITE_BASE_URL,
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
        '@': join(__dirname, 'src'),
      },
    },
  };
});
