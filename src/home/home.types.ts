export const CATEGORY_COLORS = [
  'rose',
  'sky',
  'emerald',
  'amber',
  'violet',
  'cyan',
  'lime',
  'slate',
] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const STEP_ICONS = [
  'ClipboardList',
  'FileText',
  'CreditCard',
  'ShieldCheck',
  'Ship',
  'Receipt',
  'Truck',
  'Factory',
  'Phone',
  'Handshake',
] as const;
export type StepIcon = (typeof STEP_ICONS)[number];

export interface HomeContent {
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
  };
  categories: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      href: string;
      image: string;
      alt: string;
      color: CategoryColor;
    }[];
  };
  offers: {
    eyebrow: string;
    title: string;
    text: string;
    items: {
      name: string;
      spec: string;
      price: number;
      href: string;
      image: string;
    }[];
  };
  steps: {
    title: string;
    subtitle: string;
    items: { title: string; text: string; icon: StepIcon }[];
  };
  seoText: {
    title: string;
    intro: string;
    sections: { title: string; body: string }[];
  };
  articles: {
    title: string;
    items: { title: string; href: string; image: string; date: string }[];
  };
  updatedAt?: string;
}
