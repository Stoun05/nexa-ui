import {createHash} from 'node:crypto';
import {appendFile, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {gunzipSync} from 'node:zlib';

const SOURCE_DIR = new URL('../source/', import.meta.url);
const EXPECTED_HASH = 'a3bc4245390fd7f81e481f92de576102f8a411a6aa275302fa7941f91d0aeb6e';
const sourceNames = (await readdir(SOURCE_DIR)).filter(name => name.startsWith('source-v1.2.part')).sort();
const encoded = (await Promise.all(sourceNames.map(name => readFile(new URL(name, SOURCE_DIR), 'utf8')))).join('').trim();
const payload = gunzipSync(Buffer.from(encoded, 'base64'));
const actualHash = createHash('sha256').update(payload).digest('hex');
if (actualHash !== EXPECTED_HASH) throw new Error(`Nexa UI v1.2 source integrity check failed: ${actualHash}`);
const baseFiles = JSON.parse(payload.toString('utf8'));
for (const [relativePath, content] of Object.entries(baseFiles)) {
  const outputPath = resolve(process.cwd(), relativePath); await mkdir(dirname(outputPath), {recursive:true}); await writeFile(outputPath, content, 'utf8');
}

async function applyOverrides(directoryName, label) {
  const directory = new URL(`../${directoryName}/`, import.meta.url);
  const names = (await readdir(directory)).filter(name => /^bundle-\d+\.mjs$/.test(name)).sort();
  if (!names.length) throw new Error(`${label} override bundles are missing.`);
  let count = 0;
  for (const name of names) {
    const bundle = await import(new URL(name, directory).href + `?v=${Date.now()}`);
    for (const [relativePath, content] of Object.entries(bundle.default)) {
      const outputPath = resolve(process.cwd(), relativePath); await mkdir(dirname(outputPath), {recursive:true}); await writeFile(outputPath, content, 'utf8'); count += 1;
    }
  }
  const cssTail = await readFile(new URL('global-tail.css', directory), 'utf8');
  await appendFile(resolve(process.cwd(), 'src/styles/global.css'), `\n/* ${label} */\n${cssTail}`, 'utf8');
  return count;
}

const v13 = await applyOverrides('overrides-v1.3', 'Nexa UI v1.3');
const v14 = await applyOverrides('overrides-v1.4', 'Nexa UI v1.4');
console.log(`Materialized ${Object.keys(baseFiles).length} base files, ${v13} v1.3 overrides and ${v14} v1.4 overrides.`);
