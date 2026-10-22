import { defineConfig } from 'wxt';
import manifest from './src/manifest.json';

export default defineConfig({
  srcDir: 'src',
  entrypointsDir: '.',
  publicDir: 'src/assets',
  modules: ['@wxt-dev/module-react'],
  manifest,
});
