import { bool, href, obj, str } from './validate.js';

/** Per-page SEO overrides; empty strings fall back to generated defaults on the site. */
export interface SeoFields {
  title: string;
  description: string;
  /** Empty = the page's own address. */
  canonical: string;
  index: boolean;
  follow: boolean;
}

export const SEO_DEFAULTS: SeoFields = {
  title: '',
  description: '',
  canonical: '',
  index: true,
  follow: true,
};

export function seoFields(v: unknown, path = 'seo'): SeoFields {
  const seo = obj(v, path);
  return {
    title: str(seo.title, `${path}.title`, 120, false),
    description: str(seo.description, `${path}.description`, 300, false),
    canonical: href(seo.canonical, `${path}.canonical`, false),
    index: bool(seo.index, `${path}.index`),
    follow: bool(seo.follow, `${path}.follow`),
  };
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
