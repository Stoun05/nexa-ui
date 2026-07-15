import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createInvoicePdf} from '../src/utils/pdf.mjs';

test('production index references built assets', async()=>{const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(html,/assets\/.+\.js/);assert.doesNotMatch(html,/src\/main\.tsx/);});
test('business pages are code-split',async()=>{const files=await readdir(new URL('../dist/assets/',import.meta.url));for(const name of ['UsersPage','AuditPage','DocumentsPage','ReportsPage'])assert.ok(files.some(file=>file.startsWith(name)),`${name} chunk missing`);});
test('PDF invoice generator creates a valid PDF blob',async()=>{const blob=createInvoicePdf({id:'INV-TEST',orderId:'NX-1',client:'Test Client',clientEmail:'test@example.com',service:'Admin panel',subtotal:100,tax:5,total:105,status:'draft',issuedAt:'2026-07-16',dueAt:'2026-07-23'},'en');const text=await blob.text();assert.ok(text.startsWith('%PDF-1.4'));assert.match(text,/INV-TEST/);assert.equal(blob.type,'application/pdf');});
test('React 19 compatibility shim exports jsxDEV',async()=>{const shim=await readFile(new URL('../src/astryx-jsx-dev-runtime-shim.ts',import.meta.url),'utf8');assert.match(shim,/jsxDEV/);});
