import { defineConfig } from 'vite';
import highspellPlugin from '../src/index.js';

export default defineConfig({
  plugins: [highspellPlugin()],
  build: {
    lib: {
      entry: 'input.js',
      name: 'HighSpellExample',
      fileName: 'output',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['@bgscrew/highspell-types'],
    },
  },
});
