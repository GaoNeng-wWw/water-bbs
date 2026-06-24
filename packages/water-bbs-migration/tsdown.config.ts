import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./entites/index.ts', './migrations/*', './seeders/*'],
  dts: true,
  format: ['cjs', 'esm'],
  unbundle: true,
});
