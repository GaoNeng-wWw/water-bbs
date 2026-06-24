import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./entites/*', './migrations/*', './seeders/*'],
  dts: true,
  format: ['cjs', 'esm'],
});
