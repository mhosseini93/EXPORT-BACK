import { SEO_DEFAULTS } from '../common/seo.js';
import type { ProjectInput, ProjectsSettings } from './projects.types.js';

// Seeded on first run so the projects page is not empty.
// These are SAMPLE projects: replace them with real references from the admin panel before launch.

export const PROJECTS_SETTINGS_DEFAULTS: ProjectsSettings = {
  h1: 'Steel export projects',
  intro:
    'A selection of steel supply projects delivered by SteelEx: construction, infrastructure and industrial orders shipped from Iranian mills to ports across the region.',
  seo: { ...SEO_DEFAULTS },
};

export const PROJECT_DEFAULTS: ProjectInput[] = [
  {
    slug: 'rebar-supply-residential-towers-basra',
    status: 'published',
    title: 'Rebar supply for a residential tower complex in Basra',
    summary:
      'Phased delivery of B500B rebar in 10–32 mm for a four-tower residential project, shipped in containers with mill test certificates for every heat.',
    image: '/products/rebar.svg',
    imageAlt: 'Bundles of B500B rebar ready for container loading',
    gallery: [],
    client: 'Residential construction contractor',
    location: 'Basra, Iraq',
    year: '2025',
    products: ['Rebar'],
    facts: [
      { label: 'Tonnage', value: '6,500 t' },
      { label: 'Shipments', value: '9 phased loads' },
      { label: 'Incoterm', value: 'CFR Umm Qasr' },
    ],
    body: `## The challenge

The contractor needed a steady rebar supply matched to the concrete pouring schedule of four towers, without tying up cash in a large stockpile on site.

## Our solution

We split the order into nine phased shipments planned around the construction programme. Each load mixed sizes from 10 mm to 32 mm, so every delivery covered the next floors.

- B500B (BS 4449) bars in 12 m lengths, bundled and tagged with heat numbers
- Mill test certificates and third-party inspection before each loading
- CFR delivery to Umm Qasr with tracked container shipping

## Result

All nine shipments arrived on schedule and passed site inspection. See our current [rebar price list](/prices/rebar).`,
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'structural-beams-warehouse-sohar',
    status: 'published',
    title: 'Structural beams for a logistics warehouse in Sohar',
    summary:
      'IPE and HEB beams in S275JR supplied for a steel-frame logistics warehouse, cut to project lengths and shipped break-bulk.',
    image: '/products/beam.svg',
    imageAlt: 'IPE and HEB steel beams stacked at the port',
    gallery: [],
    client: 'Steel structure fabricator',
    location: 'Sohar, Oman',
    year: '2025',
    products: ['Steel beam', 'Angle & channel'],
    facts: [
      { label: 'Tonnage', value: '2,800 t' },
      { label: 'Grades', value: 'S235JR / S275JR' },
      { label: 'Incoterm', value: 'CFR Sohar' },
    ],
    body: `## The challenge

The fabricator needed beams in non-standard lengths to reduce cutting waste in their workshop, with a tight window before fabrication started.

## Our solution

We sourced IPE 300 and HEB 240 beams from two mills and arranged cutting to project lengths before loading. UNP channels for bracing were added to the same vessel.

- EN 10025 S275JR beams with 3.1 certificates
- Break-bulk shipment for lengths over 12 m
- SGS inspection of dimensions and straightness

## Result

Fabrication started on time with less than 2% cutting waste. Compare today's [beam prices](/prices/beam).`,
    seo: { ...SEO_DEFAULTS },
  },
  {
    slug: 'line-pipe-water-network-mombasa',
    status: 'published',
    title: 'ERW line pipe for a water network in Mombasa',
    summary:
      'API 5L Gr.B ERW pipes with bevelled ends and black coating supplied for a municipal water distribution upgrade.',
    image: '/products/pipe.svg',
    imageAlt: 'ERW steel pipes with bevelled ends',
    gallery: [],
    client: 'Water infrastructure contractor',
    location: 'Mombasa, Kenya',
    year: '2024',
    products: ['Steel pipe'],
    facts: [
      { label: 'Tonnage', value: '1,900 t' },
      { label: 'Sizes', value: '4" to 12"' },
      { label: 'Standard', value: 'API 5L Gr.B' },
    ],
    body: `## The challenge

The project required coated line pipe in several diameters, delivered in one vessel to keep port and customs costs down.

## Our solution

We combined pipes from 4" to 12" in a single break-bulk shipment, with bevelled ends for field welding and black protective coating.

- API 5L Gr.B ERW pipes with hydrostatic test reports
- Bevelled ends and plastic end caps
- Bundled small diameters, loose large diameters with wooden saddles

## Result

The pipes cleared customs in one entry and installation started within two weeks of arrival. View the [steel pipe price list](/prices/pipe).`,
    seo: { ...SEO_DEFAULTS },
  },
];
