export const COLUMN_TYPES = ['text', 'price', 'change'] as const;
export type ColumnType = (typeof COLUMN_TYPES)[number];

export interface PriceColumn {
  /** Stable key that row cells refer to; survives renames and reordering. */
  id: string;
  label: string;
  /** Optional abbreviation shown on narrow screens. */
  shortLabel: string;
  type: ColumnType;
}

export interface PriceTable {
  title: string;
  note: string;
  columns: PriceColumn[];
  /** Each row maps a column id to its cell text. */
  rows: Record<string, string>[];
}

export interface PricePageSeo {
  /** Empty = generated from the h1. */
  title: string;
  /** Empty = generated from the intro. */
  description: string;
  /** Empty = /prices/<slug>. */
  canonical: string;
  index: boolean;
  follow: boolean;
}

export interface PricePageData {
  name: string;
  breadcrumb: string;
  h1: string;
  intro: string;
  summary: string;
  image: string;
  imageAlt: string;
  tables: PriceTable[];
  bottomTitle: string;
  bottomText: string;
  faqs: { question: string; answer: string }[];
  seo: PricePageSeo;
}

export interface PricePageInput extends PricePageData {
  slug: string;
}

export interface PricePage extends PricePageInput {
  id: number;
  position: number;
  updatedAt: string;
}
