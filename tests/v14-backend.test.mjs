import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('v1.4 package includes Supabase client', async()=>{
  const pkg=JSON.parse(await readFile('package.json','utf8'));
  assert.equal(pkg.version,'1.4.0');
  assert.ok(pkg.dependencies['@supabase/supabase-js']);
});

test('materialized task and calendar pages exist', async()=>{
  const [tasks,calendar,client]=await Promise.all([
    readFile('src/pages/TasksPage.tsx','utf8'),
    readFile('src/pages/CalendarPage.tsx','utf8'),
    readFile('src/lib/supabase.ts','utf8'),
  ]);
  assert.match(tasks,/kanban-board|Kanban/);
  assert.match(calendar,/calendar-grid/);
  assert.match(client,/VITE_SUPABASE_URL/);
});

test('migration enables RLS, Storage and Realtime', async()=>{
  const sql=await readFile('supabase/migrations/202607160001_nexa_v1_4.sql','utf8');
  assert.match(sql,/enable row level security/i);
  assert.match(sql,/storage\.buckets/);
  assert.match(sql,/supabase_realtime/);
  assert.match(sql,/create table if not exists public\.tasks/);
  assert.match(sql,/create table if not exists public\.calendar_events/);
});
