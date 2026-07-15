# Nexa UI — Supabase gurnama görkezmesi

Bu görkezme Nexa UI v1.4-i demo LocalStorage režiminden hakyky Supabase Auth, PostgreSQL, Storage we Realtime režimine geçirýär.

## 1. Supabase project dörediň

1. Supabase dashboard-da täze project açyň.
2. Project URL we anon/publishable key-i **Project Settings → API** bölüminden alyň.
3. Service-role key-i frontend `.env` faýlyna hiç haçan ýazmaň.

## 2. Database schema gurnaň

Supabase SQL Editor açyp şu faýly doly işlediň:

```text
supabase/migrations/202607160001_nexa_v1_4.sql
```

Migration şulary döredýär:

- `profiles`, `clients`, `services`, `orders`, `payments`, `invoices`;
- `tasks`, `calendar_events`, `documents`;
- `app_notifications`, `audit_logs`;
- role helper we `auth.users` trigger;
- Row Level Security policies;
- private `nexa-documents` Storage bucket;
- tasks/calendar/notifications üçin Realtime publication.

## 3. Ilkinji administrator dörediň

1. **Authentication → Users → Add user** arkaly ulanyjy dörediň.
2. SQL Editor-da şol ulanyjynyň `profiles` ýazgysyny administrator ediň:

```sql
update public.profiles
set role = 'admin', full_name = 'Nexa Administrator'
where id = '<AUTH_USER_UUID>';
```

## 4. Environment variables

Repository kökünde `.env.local` dörediň:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
VITE_SUPABASE_STORAGE_BUCKET=nexa-documents
```

Soň:

```bash
npm install
npm run dev
```

## 5. GitHub Pages secrets

Repository **Settings → Secrets and variables → Actions** bölüminde:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

dörediň. Workflow bu secret-lary build wagtynda Vite-e geçirýär.

## 6. Režimler

- Environment variables ýok: demo LocalStorage režimi.
- URL/key bar: Supabase Auth + Database + private Storage + Realtime.
- Supabase wagtlaýyn işlemeýän bolsa: interfeýs backend statusyny `error` diýip görkezýär; demo maglumatlar brauzerde saklanýar.

## 7. Howpsuzlyk

- Service-role key frontend-de ulanylmaýar.
- Ähli business tablisalarda RLS açyk.
- Faýl bucket-i public däl; faýllar signed URL bilen açylýar.
- Administrator/manager/operator rollarynyň write rugsatlary SQL policy arkaly çäklendirilýär.
