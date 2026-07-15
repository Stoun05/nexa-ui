# Nexa UI v1.4

Nexa UI — müşderileri, sargytlary, hyzmatlary, tölegleri, fakturalary, faýllary, işgärleri, işleri we senenama wakalaryny bir ýerden dolandyrmak üçin döredilen köp dilli administratiw ulgam.

Taslama Astryx komponentlerini custom dizaýn, React, TypeScript, Vite we optional Supabase backend bilen birleşdirýär. Supabase sazlanmasa, ulgam demo LocalStorage režiminde işlemegini dowam etdirýär.

## Taslama näme üçin döredildi?

Nexa UI kiçi we orta hyzmat kompaniýalarynda maglumatlaryň birnäçe Excel faýlyna, chat-a ýa-da aýratyn programmalara bölünip gitmek meselesini azaltmak üçin döredildi.

Esasy maksatlar:

- müşderi, sargyt we töleg maglumatlaryny merkezleşdirmek;
- işgärleriň işlerini Kanban we senenama arkaly dolandyrmak;
- rollar we RLS arkaly rugsatlary çäklendirmek;
- faktura, hasabat, audit we dokument işlerini tizleşdirmek;
- demo frontend-den hakyky online ulgama kem-kemden geçmek.

## Kimler üçin niýetlenen?

- kiçi we orta kompaniýalar;
- web/dizaýn studiýalary;
- hyzmat berýän kärhanalar;
- administratorlar we menejerler;
- operatorlar we maliýe işgärleri;
- Astryx, React we Supabase öwrenýän developerler.

## Esasy mümkinçilikler

- Türkmençe, Rusça we Iňlisçe interfeýs;
- login, logout, parol dikeltmek we demo 2FA;
- Supabase Auth ýa-da demo login;
- müşderi, sargyt, hyzmat, töleg we faktura CRUD;
- ulanyjylar, rollar we permission ulgamy;
- audit log;
- private faýl storage we signed URL;
- Task Manager we drag-and-drop Kanban;
- duşuşyk, task, sargyt we töleg senenamasy;
- Supabase Realtime arkaly tasks/calendar sinhronlaşmagy;
- hasabatlar, CSV, PDF faktura;
- JSON backup/import;
- dark mode, compact mode we responsive mobil görnüş;
- GitHub Pages-de awtomatik test + deploy.

## v1.4.0 üýtgeşmeleri

- optional Supabase backend adapter goşuldy;
- hakyky e-poçta/parol authentication taýýarlanyldy;
- PostgreSQL schema we RLS policies goşuldy;
- private `nexa-documents` Storage bucket migration-y goşuldy;
- Task Manager we dört sütünli Kanban goşuldy;
- Calendar sahypasy goşuldy;
- tasks, calendar we notifications üçin Realtime subscription goşuldy;
- Supabase sazlanmasa awtomatik demo fallback saklandy;
- GitHub Actions-a Supabase build secrets goşuldy;
- README doly repository standarty boýunça täzeden ýazyldy;
- aýratyn `docs/SUPABASE_SETUP.md` gurnama görkezmesi goşuldy.

## Ulanylan tehnologiýalar

- React 19
- TypeScript
- Vite
- Astryx Design System
- CSS
- LocalStorage demo adapter
- Supabase JavaScript client
- Supabase Auth
- PostgreSQL + Row Level Security
- Supabase Storage
- Supabase Realtime
- GitHub Actions
- GitHub Pages

## Repository gurluşy

```text
.github/workflows/        GitHub Pages CI/CD
source/                   SHA-256 bilen barlanan v1.2 baza source
overrides-v1.3/          v1.3 okalýan source override-lary
overrides-v1.4/          Supabase, Task, Kanban, Calendar override-lary
scripts/                  materialize, build smoke we test skriptleri
src/                      npm run materialize arkaly döredilýär
supabase/migrations/      PostgreSQL schema, RLS, Storage, Realtime
docs/                     gurnama we tehniki görkezmeler
tests/                    awtomatik testler
```

`src/` faýllary göni esasy çeşme hökmünde saklanmaýar. `npm run materialize` ilki barlanan v1.2 bazany açýar, soň v1.3 we v1.4 override-laryny ulanýar.

## Talaplar

- Node.js 22 maslahat berilýär;
- npm 10 ýa-da täze;
- Git;
- hakyky backend üçin Supabase project.

## Gurnamak

```bash
git clone https://github.com/Stoun05/nexa-ui.git
cd nexa-ui
npm install
npm run dev
```

Vite terminalda görkezilen local URL-i brauzerde açyň.

## Source materialize

Diňe source faýllaryny döretmek üçin:

```bash
npm run materialize
```

Bu buýruk:

1. v1.2 source paketiniň SHA-256 hash-yny barlaýar;
2. baza `src/` gurluşyny döredýär;
3. v1.3 override-laryny ulanýar;
4. v1.4 Supabase/Task/Calendar override-laryny ulanýar;
5. custom CSS gatlaklaryny birleşdirýär.

## Demo giriş

Supabase environment variables ýok wagty:

```text
E-poçta: admin@nexa.tm
Açar söz: nexa2026
Demo 2FA: 2026
```

Bu maglumatlar diňe demo režim üçin niýetlenen. Production ulanyjy parollaryny README-de saklamaň.

## Supabase backend gurnamak

Doly görkezme:

```text
docs/SUPABASE_SETUP.md
```

Gysga ädimler:

1. Supabase project dörediň;
2. `supabase/migrations/202607160001_nexa_v1_4.sql` migration-y işlediň;
3. ilkinji Auth ulanyjyny dörediň;
4. `profiles.role` bahasyny `admin` ediň;
5. `.env.local` faýlyny dolduryň;
6. `npm run dev` işlediň.

## Environment variables

`.env.example` faýlyny `.env.local` diýip kopirläň:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_STORAGE_BUCKET=nexa-documents
```

Möhüm:

- anon/publishable key frontend üçin niýetlenen;
- service-role key-i GitHub-a ýa-da frontend `.env` faýlyna goýmaň;
- RLS policy-lary öçürmäň.

## Nähili ulanmaly?

1. Ulgama giriň.
2. Müşderi goşuň.
3. Hyzmat dörediň.
4. Sargyt goşuň.
5. Töleg ýazyň.
6. Faktura çykaryň.
7. Sargyda dokument goşuň.
8. Task Manager-de işgärlere iş beriň.
9. Işi Kanban sütunlarynyň arasynda süýräň.
10. Calendar-da duşuşyk we möhlet dörediň.
11. Hasabatlary we audit log-y görüň.

## Production build

```bash
npm run build
npm run preview
```

Build netijesi `dist/` bukjasynda döredilýär.

## Test geçirmek

```bash
npm test
```

Test zynjyry şulary barlaýar:

- source materialize;
- lint;
- TypeScript production build;
- build assetleri we JavaScript sintaksisi;
- lazy-loaded page chunk-lary;
- PDF generator;
- React `jsxDEV` compatibility;
- Supabase konfigurasiýasy, migration, RLS we Storage faýllary.

## GitHub Pages deploy

`main` şahasy täzelenende `.github/workflows/deploy-pages.yml`:

1. dependency-lary gurýar;
2. `npm test` geçirýär;
3. `dist/` artifact döredýär;
4. GitHub Pages-e deploy edýär.

Supabase bilen deploy üçin repository Actions secrets goşuň:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Hakyky backend režimi

Supabase URL/key bar bolsa:

- login `signInWithPassword` arkaly geçirilýär;
- user roly `profiles` tablisasyndan alynýar;
- tasks we calendar_events PostgreSQL-de saklanýar;
- üýtgeşmeler Realtime arkaly beýleki açyk sessiýalara gelýär;
- dokumentler private Storage bucket-de saklanýar;
- faýllar wagtlaýyn signed URL bilen açylýar.

## Demo fallback režimi

Supabase sazlanmasa:

- app ak sahypa bolmaz;
- ähli häzirki frontend funksiýalar işleýär;
- maglumatlar diňe brauzer LocalStorage-da saklanýar;
- birnäçe enjam arasynda sync ýok.

## Häzirki çäklendirmeler

- remote CRUD häzirki wagtda Tasks, Calendar, Auth we Documents modullarynda gönüden-göni işjeň;
- öňki sargyt/müşderi/hyzmat/töleg modullary üçin doly remote repository adapter indiki release-de tamamlanar;
- Supabase project-i repository tarapyndan awtomatik döredilmeýär;
- e-poçta şablonlary Supabase dashboard-da aýratyn sazlanmaly;
- native mobile app ýok;
- WhatsApp/Telegram integrasiýasy ýok.

## Troubleshooting

### Sahypa ak görünýär

```text
Ctrl + F5
```

soň GitHub Actions build-iň ýaşyl bolandygyny barlaň.

### Supabase demo režimde galýar

- `.env.local` faýlynyň repository kökünde bolandygyny barlaň;
- variable atlarynyň `VITE_` bilen başlanýandygyny barlaň;
- dev server-i täzeden işlediň.

### Login işlemeýär

- Auth user döredilendigini;
- `profiles` ýazgysynyň bardygyny;
- status-yň `blocked` däldigini;
- RLS migration-yň doly işlenendigini barlaň.

### Faýl ýüklenmeýär

- `nexa-documents` bucket-i;
- Storage policies;
- 8 MB ölçeg çägi;
- rugsat berlen MIME type-lary barlaň.

### npm install haýal ýa-da işlemeýär

```bash
npm cache verify
npm install
```

Node.js 22 ulanyň we registry/network ýagdaýyny barlaň.

## Roadmap

- ähli business modullary Supabase database-e geçirmek;
- server-side invoice numbering;
- realtime notification center;
- müşderi portaly;
- e-poçta şablonlary;
- PWA/offline queue;
- full end-to-end Playwright testleri;
- custom domen we production monitoring.

## Lisensiýa

Repository public bolsa-da, aýratyn lisensiýa faýly goşulýança kod awtomatik MIT hasaplanmaýar. Täjirçilik ýa-da paýlama üçin repository eýesiniň rugsadyny barlaň.

## Awtor

Repository eýesi: **Stoun05**
