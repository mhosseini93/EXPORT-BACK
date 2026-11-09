import { SEO_DEFAULTS } from '../common/seo.js';
import type {
  BlogCategoryInput,
  BlogPostInput,
  BlogSettings,
} from './blog.types.js';

// Seeded on first run so the blog and the homepage "Latest articles" links are never empty.

export const BLOG_SETTINGS_DEFAULTS: BlogSettings = {
  h1: 'Steel export blog',
  intro:
    'Practical guides on buying steel for export: product grades, Incoterms, quality documents and market outlooks from the SteelEx team.',
  pageSize: 12,
  seo: { ...SEO_DEFAULTS },
};

export const BLOG_CATEGORY_DEFAULTS: BlogCategoryInput[] = [
  {
    slug: 'buying-guides',
    name: 'Buying guides',
    h1: 'Steel buying guides',
    intro:
      'Step-by-step guides for importers and contractors: how to choose grades and sizes, compare offers and place a steel order with confidence.',
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'shipping-and-trade',
    name: 'Shipping & trade',
    h1: 'Steel shipping and trade terms',
    intro:
      'Incoterms, payment methods, containers versus break-bulk and everything else that turns a steel price into a delivered cargo.',
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'quality-and-standards',
    name: 'Quality & standards',
    h1: 'Steel quality and standards',
    intro:
      'How to read mill test certificates, compare international standards and organise third-party inspection before loading.',
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'market-news',
    name: 'Market news',
    h1: 'Steel market news and outlook',
    intro:
      'Analysis of raw material costs, mill offers and freight rates that move the export price of steel products.',
    seo: { ...SEO_DEFAULTS },
  },
];

type SeedPost = Omit<BlogPostInput, 'categoryId'> & { category: string };

export const BLOG_POST_DEFAULTS: SeedPost[] = [
  {
    slug: 'choose-rebar-grade',
    category: 'buying-guides',
    status: 'published',
    publishedAt: '2026-11-05',
    title: 'How to choose the right rebar grade for your project',
    excerpt:
      'A3, B500B or Grade 60? Learn how yield strength, ductility and local codes decide which rebar grade you should order.',
    image: '/articles/rebar-grade.svg',
    imageAlt: 'Rebar bundles labelled with different steel grades',
    body: `Choosing a rebar grade is not only about price per ton. The grade sets the yield strength, ductility and weldability of the bars, and your structural engineer will design around those numbers.

## The most common export grades

- **A3 (ISIRI 3132):** a 400 MPa class bar widely used in the Middle East and Central Asia.
- **B500B (BS 4449):** a 500 MPa bar with good ductility, accepted in most British-standard markets.
- **Grade 60 (ASTM A615):** the 420 MPa American grade, common in projects designed to ACI codes.

## Match the grade to your building code

Start with the code your drawings follow. A project designed to Eurocode or BS standards normally calls for B500B, while ACI-based designs specify ASTM grades. Substituting a grade without approval can delay inspection and payment.

## Check ductility for seismic zones

In earthquake regions, engineers look at the ratio of tensile to yield strength and at elongation. B500B and the weldable ASTM A706 grade are designed for this. Ask for these values on the mill test certificate.

## Sizes and lengths

Rebar is usually supplied in 12 m lengths, from 8 mm to 32 mm. Ordering a mix of sizes in one container is possible, which helps smaller projects keep freight costs down.

> Tip: send us your bar schedule and we will suggest the closest standard grade and the most economical size mix.

See today's [rebar price list](/prices/rebar) or [request a price inquiry](/price-inquiry) for a proforma within 24 hours.`,
    faqs: [
      {
        question: 'Is B500B stronger than A3 rebar?',
        answer:
          'Yes. B500B has a minimum yield strength of 500 MPa, while A3 is a 400 MPa class bar, so B500B carries more load per bar.',
      },
      {
        question: 'Can I mix rebar sizes in one container?',
        answer:
          'Yes, a 20 ft container can hold about 25 tons of mixed sizes as long as all bars are the same length.',
      },
    ],
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'fob-vs-cfr',
    category: 'shipping-and-trade',
    status: 'published',
    publishedAt: '2026-10-29',
    title: 'FOB vs CFR: which Incoterm is better for steel imports?',
    excerpt:
      'FOB gives you control of freight, CFR gives you one delivered price. Compare costs, risks and paperwork before you sign.',
    image: '/articles/incoterms.svg',
    imageAlt: 'Container ship being loaded with steel at port',
    body: `FOB and CFR are the two Incoterms we quote most often for steel. Both move the risk to the buyer once the goods are loaded on the vessel, but they split the freight cost differently.

## FOB (Free On Board)

The seller delivers the steel on board the vessel at the port of loading, for example Bandar Abbas. The buyer books and pays the sea freight and insurance.

- Best when you have a freight forwarder or a contract rate with a shipping line.
- You control the vessel schedule and transit time.

## CFR (Cost and Freight)

The seller pays the freight to your destination port, but the risk still passes to you at loading. You only pay insurance and the costs at the destination.

- Best when you want one clear landed price to compare offers.
- Useful for first orders or smaller volumes without a forwarder.

## Which costs less?

For large and regular volumes, FOB with your own freight contract is usually cheaper. For occasional buyers, CFR often wins because exporters negotiate bulk freight rates across many shipments.

> Whichever term you choose, always insure the cargo: under both FOB and CFR the risk is yours from the moment of loading.

Our [price lists](/prices) are quoted FOB. Ask for a CFR quote to your port through a [price inquiry](/price-inquiry).`,
    faqs: [
      {
        question: 'Who pays insurance under CFR?',
        answer:
          'The buyer. CFR covers cost and freight only; for seller-paid insurance the term is CIF.',
      },
    ],
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'mill-test-certificate',
    category: 'quality-and-standards',
    status: 'published',
    publishedAt: '2026-10-21',
    title: 'Reading a mill test certificate in 5 minutes',
    excerpt:
      'Heat numbers, chemical composition and mechanical tests: a quick checklist for checking a steel mill test certificate.',
    image: '/articles/mtc.svg',
    imageAlt: 'Mill test certificate document next to steel samples',
    body: `A mill test certificate (MTC) is the steel's passport. It proves that the material in your shipment meets the ordered standard and grade. Here is what to check first.

## 1. Header details

Confirm the mill name, certificate number, product, size, standard and grade. They must match your contract and the packing list.

## 2. Heat numbers

Every bundle or coil carries a heat number on its tag. Each heat number on the tags should appear on the certificate, so you can trace every ton back to its melt.

## 3. Chemical composition

Compare carbon, manganese, sulphur and phosphorus against the limits of the standard. For weldable grades, also check the carbon equivalent (CEV).

## 4. Mechanical properties

- **Yield strength** must be at or above the grade minimum.
- **Tensile strength** and the tensile-to-yield ratio show ductility.
- **Elongation** shows how much the bar can stretch before breaking.

## 5. Certificate type

An EN 10204 type 3.1 certificate is issued by the mill's own inspection department, independent of production. Type 3.2 adds an external inspector's signature.

For extra assurance, we can arrange SGS or Bureau Veritas inspection before loading. Read more in our [rebar grade guide](/blog/choose-rebar-grade).`,
    faqs: [],
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'steel-price-outlook',
    category: 'market-news',
    status: 'published',
    publishedAt: '2026-10-12',
    title: 'Steel price outlook for the next quarter',
    excerpt:
      'Iron ore, billet and freight trends that will shape export steel prices over the coming three months.',
    image: '/articles/outlook.svg',
    imageAlt: 'Line chart of steel prices over time',
    body: `Export steel prices follow a few key inputs. Watching them helps you decide when to book your next order.

## Raw materials

Iron ore and billet prices set the floor for finished steel. When billet offers rise, long products such as rebar and wire rod usually follow within two to four weeks.

## Mill capacity and energy

Seasonal energy restrictions can reduce mill output in winter, which tightens supply and supports prices. Mills often publish their export allocation monthly.

## Freight rates

Sea freight is a growing share of the landed cost. Rising container rates make CFR offers more expensive even when FOB prices are stable.

## What it means for buyers

- Book larger volumes early when billet prices start to firm.
- Keep delivery windows flexible to benefit from mills with spare capacity.
- Compare FOB and CFR offers: read our [FOB vs CFR guide](/blog/fob-vs-cfr).

Check the latest numbers on our [steel price lists](/prices), updated every working day.`,
    faqs: [],
    seo: { ...SEO_DEFAULTS },
  },
];
