import { mergeConfig } from 'vite';
import viteBaseConfig, { plugins } from './vite.base.config';

export default mergeConfig({
  plugins: [
    ...plugins,
  ],
}, viteBaseConfig);
