import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {dirname, resolve} from 'node:path';

const SOURCE_DIR = new URL('../source/', import.meta.url);
const EXPECTED_HASH = '8e6fdf446356dbd173ec99acffcf8d8f0e31fd949d0b5a2d5c144bd1760c7b23';

const partNames = (await readdir(SOURCE_DIR))
  .filter(name => name.startsWith('source-v1.1.part'))
  .sort();
const encoded = (await Promise.all(partNames.map(name => readFile(new URL(name, SOURCE_DIR), 'utf8')))).join('').trim();
const payload = gunzipSync(Buffer.from(encoded, 'base64'));
const actualHash = createHash('sha256').update(payload).digest('hex');

if (actualHash !== EXPECTED_HASH) {
  throw new Error(`Nexa UI source integrity check failed: ${actualHash}`);
}

const files = JSON.parse(payload.toString('utf8'));
for (const [relativePath, content] of Object.entries(files)) {
  const outputPath = resolve(process.cwd(), relativePath);
  await mkdir(dirname(outputPath), {recursive: true});
  await writeFile(outputPath, content, 'utf8');
}

console.log(`Materialized ${Object.keys(files).length} Nexa UI source files.`);
