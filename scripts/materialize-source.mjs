import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {dirname, resolve} from 'node:path';

const SOURCE_DIR = new URL('../source/', import.meta.url);
const EXPECTED_HASH = 'a3bc4245390fd7f81e481f92de576102f8a411a6aa275302fa7941f91d0aeb6e';
const names = (await readdir(SOURCE_DIR)).filter(name => name.startsWith('source-v1.2.part')).sort();
const encoded = (await Promise.all(names.map(name => readFile(new URL(name, SOURCE_DIR), 'utf8')))).join('').trim();
const payload = gunzipSync(Buffer.from(encoded, 'base64'));
const actualHash = createHash('sha256').update(payload).digest('hex');
if (actualHash !== EXPECTED_HASH) throw new Error(`Nexa UI source integrity check failed: ${actualHash}`);
const files = JSON.parse(payload.toString('utf8'));
for (const [relativePath, content] of Object.entries(files)) {
  const outputPath = resolve(process.cwd(), relativePath);
  await mkdir(dirname(outputPath), {recursive: true});
  await writeFile(outputPath, content, 'utf8');
}
console.log(`Materialized ${Object.keys(files).length} Nexa UI v1.2 source files.`);
