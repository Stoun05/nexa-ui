# Nexa UI v1.1

Nexa UI — Astryx komponentleri bilen custom dizaýny birleşdirýän türkmençe dolandyryş merkezi.

## v1.1-de edilen işler

- 31 sany source faýldan ybarat `app/pages/components/hooks/data/utils/styles` gurluşy;
- source paketi SHA-256 bilen barlanýar we `npm run materialize` arkaly `src/` bukjasyna açylýar;
- React lazy loading we sahypa boýunça code splitting;
- doly sargyt CRUD: goşmak, redaktirlemek, pozmak, status/progress üýtgetmek;
- toparlaýyn saýlama, toparlaýyn status we pozmak;
- 4 ädimli sargyt wizard-y we LocalStorage auto-save;
- müşderi profili, sargyt taryhy, bellikler we redaktirleme;
- professional sticky-header tablisa we mobil kart görnüşi;
- dashboard widgetlerini gizlemek we tertibini üýtgetmek;
- custom loading, empty state, error boundary, toast we micro-interactionlar;
- ýagty/garaňky režim, ykjam tablisa we reduced-motion sazlamasy;
- responsive desktop, tablet we mobil navigasiýa;
- CSV eksport we analitika sahypasy;
- GitHub Pages üçin lint + build + deploy workflow.

## Source gurluşyny açmak

```bash
npm install
npm run materialize
```

Bu buýruk `source/source-v1.1.part*` böleklerini birleşdirip, SHA-256 boýunça barlaýar we 31 sany okalýan TypeScript/CSS faýlyny `src/` içine döredýär.

## Işletmek

```bash
npm run dev
```

## Barlag

```bash
npm run lint
npm run build
```

`main` şahasy täzelenende GitHub Pages workflow awtomatik işleýär.
