import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      'react/jsx-dev-runtime': fileURLToPath(
        new URL('./src/astryx-jsx-dev-runtime-shim.ts', import.meta.url),
      ),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('node_modules/@astryxdesign')) return 'astryx';
          return undefined;
        },
      },
    },
  },
});
