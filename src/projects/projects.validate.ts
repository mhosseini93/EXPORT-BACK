import { BadRequestException } from '@nestjs/common';
import { SLUG_RE, seoFields } from '../common/seo.js';
import { arr, href, obj, oneOf, str } from '../common/validate.js';
import {
  PROJECT_STATUSES,
  type ProjectInput,
  type ProjectsSettings,
} from './projects.types.js';

export function sanitizeProject(input: unknown): ProjectInput {
  const b = obj(input, 'body');
  const slug = str(b.slug, 'slug', 120);
  if (!SLUG_RE.test(slug)) {
    throw new BadRequestException(
      'slug may contain only lowercase letters, digits and single hyphens',
    );
  }
  const status = oneOf(b.status, PROJECT_STATUSES, 'status');
  const year = str(b.year, 'year', 4, false);
  if (year && !/^(19|20)\d{2}$/.test(year)) {
    throw new BadRequestException('year must be a 4-digit year');
  }

  return {
    slug,
    status,
    title: str(b.title, 'title', 160),
    summary: str(b.summary, 'summary', 400),
    body: str(b.body, 'body', 30000, false),
    image: href(b.image, 'image'),
    imageAlt: str(b.imageAlt, 'imageAlt', 160),
    gallery: arr(b.gallery, 'gallery', 12).map((raw, i) => {
      const g = obj(raw, `gallery[${i}]`);
      return {
        image: href(g.image, `gallery[${i}].image`),
        alt: str(g.alt, `gallery[${i}].alt`, 160),
      };
    }),
    client: str(b.client, 'client', 120, false),
    location: str(b.location, 'location', 120, false),
    year,
    // Empty entries come from a trailing comma in the editor; drop them.
    products: arr(b.products, 'products', 10)
      .map((p, i) => str(p, `products[${i}]`, 40, false))
      .filter(Boolean),
    facts: arr(b.facts, 'facts', 8).map((raw, i) => {
      const f = obj(raw, `facts[${i}]`);
      return {
        label: str(f.label, `facts[${i}].label`, 40),
        value: str(f.value, `facts[${i}].value`, 60),
      };
    }),
    seo: seoFields(b.seo),
  };
}

export function sanitizeProjectsSettings(input: unknown): ProjectsSettings {
  const b = obj(input, 'body');
  return {
    h1: str(b.h1, 'h1', 120),
    intro: str(b.intro, 'intro', 1000, false),
    seo: seoFields(b.seo),
  };
}
