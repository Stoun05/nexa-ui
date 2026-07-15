import {createHash} from 'node:crypto';
import {appendFile, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';

const SOURCE_DIR = new URL('../source/', import.meta.url);
const OVERRIDE_DIR = new URL('../overrides-v1.3/', import.meta.url);
const EXPECTED_HASH = 'a3bc4245390fd7f81e481f92de576102f8a411a6aa275302fa7941f91d0aeb6e';

const sourceNames = (await readdir(SOURCE_DIR))
  .filter(name => name.startsWith('source-v1.2.part'))
  .sort();
const encoded = (await Promise.all(sourceNames.map(name => readFile(new URL(name, SOURCE_DIR), 'utf8')))).join('').trim();
const payload = gunzipSync(Buffer.from(encoded, 'base64'));
const actualHash = createHash('sha256').update(payload).digest('hex');
if (actualHash !== EXPECTED_HASH) {
  throw new Error(`Nexa UI v1.2 source integrity check failed: ${actualHash}`);
}

const baseFiles = JSON.parse(payload.toString('utf8'));
for (const [relativePath, content] of Object.entries(baseFiles)) {
  const outputPath = resolve(process.cwd(), relativePath);
  await mkdir(dirname(outputPath), {recursive: true});
  await writeFile(outputPath, content, 'utf8');
}

const bundleNames = (await readdir(OVERRIDE_DIR))
  .filter(name => /^bundle-\d+\.mjs$/.test(name))
  .sort();
if (!bundleNames.length) throw new Error('Nexa UI v1.3 override bundles are missing.');

let overrideCount = 0;
for (const name of bundleNames) {
  const bundle = await import(new URL(name, OVERRIDE_DIR).href);
  for (const [relativePath, content] of Object.entries(bundle.default)) {
    const outputPath = resolve(process.cwd(), relativePath);
    await mkdir(dirname(outputPath), {recursive: true});
    await writeFile(outputPath, content, 'utf8');
    overrideCount += 1;
  }
}

const cssTail = await readFile(new URL('global-tail.css', OVERRIDE_DIR), 'utf8');
await appendFile(resolve(process.cwd(), 'src/styles/global.css'), cssTail, 'utf8');
console.log(`Materialized ${Object.keys(baseFiles).length} base files and applied ${overrideCount} Nexa UI v1.3 overrides.`);
