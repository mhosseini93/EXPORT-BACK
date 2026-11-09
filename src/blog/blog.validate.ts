import { BadRequestException } from '@nestjs/common';
import { SLUG_RE, seoFields } from '../common/seo.js';
import { arr, href, obj, oneOf, str } from '../common/validate.js';
import {
  POST_STATUSES,
  type BlogCategoryInput,
  type BlogPostInput,
  type BlogSettings,
} from './blog.types.js';

function slug(v: unknown, max: number): string {
  const s = str(v, 'slug', max);
  if (!SLUG_RE.test(s)) {
    throw new BadRequestException(
      'slug may contain only lowercase letters, digits and single hyphens',
    );
  }
  return s;
}

// /blog/page/2 and /blog/category/x are site routes, so a post cannot use these slugs.
const RESERVED_POST_SLUGS = new Set(['page', 'category']);

export function sanitizeCategory(input: unknown): BlogCategoryInput {
  const b = obj(input, 'body');
  return {
    slug: slug(b.slug, 80),
    name: str(b.name, 'name', 60),
    h1: str(b.h1, 'h1', 120, false),
    intro: str(b.intro, 'intro', 1000, false),
    seo: seoFields(b.seo),
  };
}

export function sanitizePost(input: unknown): BlogPostInput {
  const b = obj(input, 'body');
  const status = oneOf(b.status, POST_STATUSES, 'status');

  let publishedAt = str(b.publishedAt, 'publishedAt', 10, false);
  if (publishedAt) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ||
      Number.isNaN(Date.parse(publishedAt))
    ) {
      throw new BadRequestException('publishedAt must be YYYY-MM-DD');
    }
  } else if (status === 'published') {
    publishedAt = new Date().toISOString().slice(0, 10);
  }

  const categoryId = b.categoryId;
  if (
    categoryId !== null &&
    (typeof categoryId !== 'number' || !Number.isInteger(categoryId))
  ) {
    throw new BadRequestException('categoryId must be a category id or null');
  }

  const postSlug = slug(b.slug, 120);
  if (RESERVED_POST_SLUGS.has(postSlug)) {
    throw new BadRequestException(`The slug "${postSlug}" is reserved`);
  }

  return {
    slug: postSlug,
    categoryId,
    status,
    publishedAt,
    title: str(b.title, 'title', 160),
    excerpt: str(b.excerpt, 'excerpt', 300),
    body: str(b.body, 'body', 50000, status === 'published'),
    image: href(b.image, 'image'),
    imageAlt: str(b.imageAlt, 'imageAlt', 160),
    faqs: arr(b.faqs, 'faqs', 10).map((raw, i) => {
      const f = obj(raw, `faqs[${i}]`);
      return {
        question: str(f.question, `faqs[${i}].question`, 200),
        answer: str(f.answer, `faqs[${i}].answer`, 1500),
      };
    }),
    seo: seoFields(b.seo),
  };
}

export function sanitizeSettings(input: unknown): BlogSettings {
  const b = obj(input, 'body');
  const pageSize = b.pageSize;
  if (
    typeof pageSize !== 'number' ||
    !Number.isInteger(pageSize) ||
    pageSize < 3 ||
    pageSize > 48
  ) {
    throw new BadRequestException(
      'pageSize must be a whole number from 3 to 48',
    );
  }
  return {
    h1: str(b.h1, 'h1', 120),
    intro: str(b.intro, 'intro', 1000, false),
    pageSize,
    seo: seoFields(b.seo),
  };
}
