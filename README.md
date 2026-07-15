# Nexa UI v1.3

Nexa UI — Astryx komponentleri we custom dizaýn bilen gurlan köp dilli dolandyryş merkezi.

## v1.3-de goşulanlar

- ulanyjylar we rollar: administrator, menejer, operator, diňe görýän ulanyjy;
- her rol üçin aýratyn rugsatlar we hereketleriň goragy;
- audit log: kim, haçan we näme üýtgetdi;
- sargytlara surat we dokument ýüklemek, preview, download we pozmak;
- sene, hyzmat we status boýunça giň hasabatlar;
- girdeji, çykdajy, arassa peýda, hyzmat reýtingi we status grafikler;
- göni `%PDF-1.4` faktura döretmek we ýüklemek;
- ähli ýerli maglumatlary JSON backup görnüşinde çykarmak we dikeltmek;
- lint, production build, asset/sintaksis, lazy chunk, PDF we React `jsxDEV` testleri;
- GitHub Pages deploy-dan öň awtomatik `npm test`.

## Öňki mümkinçilikler

- `Ctrl/Cmd + K` global gözleg;
- habarnamalar merkezi;
- sargyt, müşderi, hyzmat, töleg we faktura dolandyryşy;
- dashboard widget drag-and-drop;
- login, parol dikeltmek we optional 2FA demo;
- Türkmençe, Rusça we Iňlisçe;
- dark mode, compact mode we responsive mobil görnüş.

## Demo giriş

- E-poçta: `admin@nexa.tm`
- Açar söz: `nexa2026`
- 2FA demo kody: `2026`

## Işletmek

```bash
npm install
npm run dev
```

## Doly barlag

```bash
npm test
```

`npm run materialize` öňki SHA-256 bilen barlanan v1.2 bazany açýar, soň `overrides-v1.3` bukjasyndaky okalýan modullary ulanýar.

`main` şahasy täzelenende GitHub Pages workflow ähli testleri geçirip, diňe şondan soň deploy edýär.
