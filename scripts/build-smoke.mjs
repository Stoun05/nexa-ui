import {readFile, readdir, access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const dist=resolve(process.cwd(),'dist');
const html=await readFile(resolve(dist,'index.html'),'utf8');
const refs=[...html.matchAll(/(?:src|href)="([^"]+assets\/[^"]+)"/g)].map(match=>match[1].replace(/^\.\//,''));
if(!refs.length) throw new Error('No production assets found in index.html');
for(const ref of refs) await access(resolve(dist,ref));
const assets=await readdir(resolve(dist,'assets'));
for(const file of assets.filter(name=>name.endsWith('.js'))){const result=spawnSync(process.execPath,['--check',resolve(dist,'assets',file)],{encoding:'utf8'});if(result.status!==0)throw new Error(`Syntax check failed for ${file}: ${result.stderr}`);}
const shim=await readFile(resolve(process.cwd(),'src/astryx-jsx-dev-runtime-shim.ts'),'utf8');
if(!shim.includes('jsxDEV')) throw new Error('React 19 jsxDEV shim missing');
console.log(`Build smoke passed: ${refs.length} linked assets, ${assets.filter(name=>name.endsWith('.js')).length} JavaScript chunks.`);
