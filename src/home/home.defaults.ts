import type { HomeContent } from './home.types.js';

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    badge: 'Direct from Iranian mills · Worldwide delivery',
    titleStart: 'Steel products export,',
    titleHighlight: 'priced fairly, shipped on time',
    text: 'Buy rebar, steel sheets, beams, profiles and angles with mill test certificates, third-party inspection and FOB or CFR delivery to your port.',
    ctaLabel: "Get today's price",
    ctaHref: '/price-inquiry',
  },
  categories: {
    title: 'Steel product categories',
    subtitle: "Pick a category to see sizes, grades and today's export price.",
    items: [
      {
        name: 'Rebar',
        href: '/prices/rebar',
        image: '/products/rebar.svg',
        alt: 'Bundle of ribbed steel rebar for export',
        color: 'rose',
      },
      {
        name: 'Steel sheet',
        href: '/prices/sheet',
        image: '/products/sheet.svg',
        alt: 'Stack of hot-rolled steel sheets',
        color: 'sky',
      },
      {
        name: 'Steel beam',
        href: '/prices/beam',
        image: '/products/beam.svg',
        alt: 'IPE and HEB steel beams',
        color: 'emerald',
      },
      {
        name: 'Profile & tube',
        href: '/prices/profile',
        image: '/products/profile.svg',
        alt: 'Square and rectangular steel profiles',
        color: 'amber',
      },
      {
        name: 'Angle & channel',
        href: '/prices/angle',
        image: '/products/angle.svg',
        alt: 'Steel angle and channel bars',
        color: 'violet',
      },
      {
        name: 'Steel pipe',
        href: '/prices/pipe',
        image: '/products/pipe.svg',
        alt: 'Seamless and welded steel pipes',
        color: 'cyan',
      },
      {
        name: 'Wire rod',
        href: '/prices/wire-rod',
        image: '/products/wire-rod.svg',
        alt: 'Coils of steel wire rod',
        color: 'lime',
      },
    ],
  },
  offers: {
    eyebrow: 'Special offers',
    title: 'Buy with the pros',
    text: "This week's best export prices, FOB Bandar Abbas per metric ton. Prices are updated daily.",
    items: [
      {
        name: 'Rebar',
        spec: 'A3 / B500B · 10–32 mm',
        price: 545,
        href: '/prices/rebar',
        image: '/products/rebar.svg',
      },
      {
        name: 'Profile',
        spec: 'ST37 · 20×20 to 100×100 mm',
        price: 612,
        href: '/prices/profile',
        image: '/products/profile.svg',
      },
    ],
  },
  steps: {
    title: 'Buy just this easily',
    subtitle: 'Six simple steps from inquiry to delivery at your port.',
    items: [
      {
        title: 'Purchase request',
        text: 'Send the product, grade, size and tonnage by phone, form or WhatsApp.',
        icon: 'ClipboardList',
      },
      {
        title: 'Proforma invoice',
        text: 'Receive a proforma with FOB/CFR price, delivery time and terms within 24 hours.',
        icon: 'FileText',
      },
      {
        title: 'Payment method',
        text: 'Choose T/T, irrevocable L/C at sight or our credit purchase plan.',
        icon: 'CreditCard',
      },
      {
        title: 'Quality control',
        text: 'Mill test certificates plus SGS or Bureau Veritas inspection before loading.',
        icon: 'ShieldCheck',
      },
      {
        title: 'Loading & transport',
        text: 'Containers or break-bulk vessels from Bandar Abbas with tracked shipping.',
        icon: 'Ship',
      },
      {
        title: 'Official invoice',
        text: 'Commercial invoice, packing list, B/L and certificate of origin are issued.',
        icon: 'Receipt',
      },
    ],
  },
  seoText: {
    title: 'Steel price today',
    intro:
      'The steel price today depends on the product, grade, size, order volume and delivery terms. SteelEx publishes daily FOB prices for rebar, steel sheets, beams, profiles and angles, so importers and contractors can compare offers and plan their purchases with confidence.',
    sections: [
      {
        title: 'What affects the export price of steel?',
        body: 'Raw material costs such as iron ore and billet, energy prices, mill capacity and global demand all move steel prices. Freight rates and the chosen Incoterm (FOB or CFR) also change the final landed cost at your port.',
      },
      {
        title: 'How to get the best steel price',
        body: 'Ordering larger tonnage, choosing flexible delivery windows and confirming payment by L/C or T/T early can lower your price. Send a steel price inquiry and our sales team will reply with a proforma invoice within 24 hours.',
      },
    ],
  },
  articles: {
    title: 'Latest articles',
    items: [
      {
        title: 'How to choose the right rebar grade for your project',
        href: '/blog/choose-rebar-grade',
        image: '/articles/rebar-grade.svg',
        date: '2026-11-05',
      },
      {
        title: 'FOB vs CFR: which Incoterm is better for steel imports?',
        href: '/blog/fob-vs-cfr',
        image: '/articles/incoterms.svg',
        date: '2026-10-29',
      },
      {
        title: 'Reading a mill test certificate in 5 minutes',
        href: '/blog/mill-test-certificate',
        image: '/articles/mtc.svg',
        date: '2026-10-21',
      },
      {
        title: 'Steel price outlook for the next quarter',
        href: '/blog/steel-price-outlook',
        image: '/articles/outlook.svg',
        date: '2026-10-12',
      },
    ],
  },
};
