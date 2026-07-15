import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {fileURLToPath, URL} from 'node:url';
import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';

const APP_ID = 'virtual:nexa-app';
const APP_RESOLVED = `\0${APP_ID}.tsx`;
const STYLE_ID = 'virtual:nexa-styles.css';
const STYLE_RESOLVED = `\0${STYLE_ID}`;
const APP_HASH = '0a2807dbe3474f25d7e48aef5e7c582ffb4efe7e3db38aa56a5728eba89d3c42';
const STYLE_HASH = 'bdd88fde57d26fb9a29172b537370148620b984d362fbfe40aa10f38bfc8cd12';

function readRuntime(prefix: string, expectedHash: string) {
  const directory = fileURLToPath(new URL('./runtime/', import.meta.url));
  const encoded = readdirSync(directory)
    .filter((name) => name.startsWith(`${prefix}.gz.b64.part`))
    .sort()
    .map((name) => readFileSync(new URL(`./runtime/${name}`, import.meta.url), 'utf8'))
    .join('');
  const source = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
  const hash = createHash('sha256').update(source).digest('hex');
  if (hash !== expectedHash) throw new Error(`${prefix} runtime integrity check failed: ${hash}`);
  return source;
}

function nexaRuntimePlugin(): Plugin {
  return {
    name: 'nexa-runtime',
    resolveId(id) {
      if (id === APP_ID) return APP_RESOLVED;
      if (id === STYLE_ID) return STYLE_RESOLVED;
      return null;
    },
    load(id) {
      if (id === APP_RESOLVED) return readRuntime('app', APP_HASH);
      if (id === STYLE_RESOLVED) return readRuntime('styles', STYLE_HASH);
      return null;
    },
  };
}

export default defineConfig({
  plugins: [react(), nexaRuntimePlugin()],
  base: './',
  resolve: {
    alias: {
      'react/jsx-dev-runtime': fileURLToPath(
        new URL('./src/astryx-jsx-dev-runtime-shim.ts', import.meta.url),
      ),
    },
  },
  build: {target: 'es2022'},
});
