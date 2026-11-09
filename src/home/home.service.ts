import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DatabaseService } from '../database/database.service.js';
import { homeContent } from '../database/schema.js';
import { HOME_DEFAULTS } from './home.defaults.js';
import {
  CATEGORY_COLORS,
  STEP_ICONS,
  type CategoryColor,
  type HomeContent,
  type StepIcon,
} from './home.types.js';

// Pre-database storage; read once to seed the table, never written.
const LEGACY_STORE = join(process.cwd(), 'data', 'home.json');

type Obj = Record<string, unknown>;

function obj(v: unknown, path: string): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new BadRequestException(`${path} must be an object`);
  }
  return v as Obj;
}

function str(v: unknown, path: string, max: number, required = true): string {
  if (typeof v !== 'string') {
    throw new BadRequestException(`${path} must be a string`);
  }
  const s = v.trim();
  if (required && !s) throw new BadRequestException(`${path} is required`);
  if (s.length > max) {
    throw new BadRequestException(`${path} must be at most ${max} characters`);
  }
  return s;
}

/** Internal path ("/x") or absolute http(s) URL. */
function href(v: unknown, path: string): string {
  const s = str(v, path, 300);
  if (!/^\/(?!\/)/.test(s) && !/^https?:\/\//i.test(s)) {
    throw new BadRequestException(`${path} must start with / or http(s)://`);
  }
  return s;
}

function arr(v: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(v))
    throw new BadRequestException(`${path} must be a list`);
  if (v.length > max) {
    throw new BadRequestException(`${path} can have at most ${max} items`);
  }
  return v;
}

function oneOf<T extends string>(
  v: unknown,
  list: readonly T[],
  path: string,
): T {
  if (typeof v !== 'string' || !(list as readonly string[]).includes(v)) {
    throw new BadRequestException(`${path} must be one of ${list.join(', ')}`);
  }
  return v as T;
}

function sanitize(input: unknown): HomeContent {
  const root = obj(input, 'body');

  const hero = obj(root.hero, 'hero');
  const categories = obj(root.categories, 'categories');
  const offers = obj(root.offers, 'offers');
  const steps = obj(root.steps, 'steps');
  const seoText = obj(root.seoText, 'seoText');
  const articles = obj(root.articles, 'articles');

  return {
    hero: {
      badge: str(hero.badge, 'hero.badge', 120, false),
      titleStart: str(hero.titleStart, 'hero.titleStart', 120),
      titleHighlight: str(
        hero.titleHighlight,
        'hero.titleHighlight',
        120,
        false,
      ),
      text: str(hero.text, 'hero.text', 400),
      ctaLabel: str(hero.ctaLabel, 'hero.ctaLabel', 60),
      ctaHref: href(hero.ctaHref, 'hero.ctaHref'),
    },
    categories: {
      title: str(categories.title, 'categories.title', 120),
      subtitle: str(categories.subtitle, 'categories.subtitle', 300, false),
      items: arr(categories.items, 'categories.items', 16).map((raw, i) => {
        const p = `categories.items[${i}]`;
        const it = obj(raw, p);
        return {
          name: str(it.name, `${p}.name`, 60),
          href: href(it.href, `${p}.href`),
          image: href(it.image, `${p}.image`),
          alt: str(it.alt, `${p}.alt`, 160),
          color: oneOf<CategoryColor>(it.color, CATEGORY_COLORS, `${p}.color`),
        };
      }),
    },
    offers: {
      eyebrow: str(offers.eyebrow, 'offers.eyebrow', 60, false),
      title: str(offers.title, 'offers.title', 120),
      text: str(offers.text, 'offers.text', 400, false),
      items: arr(offers.items, 'offers.items', 6).map((raw, i) => {
        const p = `offers.items[${i}]`;
        const it = obj(raw, p);
        const price = Number(it.price);
        if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) {
          throw new BadRequestException(`${p}.price must be a positive number`);
        }
        return {
          name: str(it.name, `${p}.name`, 60),
          spec: str(it.spec, `${p}.spec`, 120, false),
          price: Math.round(price * 100) / 100,
          href: href(it.href, `${p}.href`),
          image: href(it.image, `${p}.image`),
        };
      }),
    },
    steps: {
      title: str(steps.title, 'steps.title', 120),
      subtitle: str(steps.subtitle, 'steps.subtitle', 300, false),
      items: arr(steps.items, 'steps.items', 10).map((raw, i) => {
        const p = `steps.items[${i}]`;
        const it = obj(raw, p);
        return {
          title: str(it.title, `${p}.title`, 80),
          text: str(it.text, `${p}.text`, 300),
          icon: oneOf<StepIcon>(it.icon, STEP_ICONS, `${p}.icon`),
        };
      }),
    },
    seoText: {
      title: str(seoText.title, 'seoText.title', 120),
      intro: str(seoText.intro, 'seoText.intro', 1500),
      sections: arr(seoText.sections, 'seoText.sections', 12).map((raw, i) => {
        const p = `seoText.sections[${i}]`;
        const it = obj(raw, p);
        return {
          title: str(it.title, `${p}.title`, 160),
          body: str(it.body, `${p}.body`, 3000),
        };
      }),
    },
    articles: {
      title: str(articles.title, 'articles.title', 120),
      items: arr(articles.items, 'articles.items', 8).map((raw, i) => {
        const p = `articles.items[${i}]`;
        const it = obj(raw, p);
        const date = str(it.date, `${p}.date`, 10);
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
          Number.isNaN(Date.parse(date))
        ) {
          throw new BadRequestException(`${p}.date must be YYYY-MM-DD`);
        }
        return {
          title: str(it.title, `${p}.title`, 160),
          href: href(it.href, `${p}.href`),
          image: href(it.image, `${p}.image`),
          date,
        };
      }),
    },
  };
}

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  async get(): Promise<HomeContent> {
    const row = await this.read();
    if (row) return row;
    await this.db
      .insert(homeContent)
      .values({ id: 1, content: await this.initialContent() })
      .onConflictDoNothing();
    return (await this.read())!;
  }

  async update(input: unknown): Promise<HomeContent> {
    const content = sanitize(input);
    const updatedAt = new Date();
    await this.db
      .insert(homeContent)
      .values({ id: 1, content, updatedAt })
      .onConflictDoUpdate({
        target: homeContent.id,
        set: { content, updatedAt },
      });
    return { ...content, updatedAt: updatedAt.toISOString() };
  }

  private async read(): Promise<HomeContent | null> {
    const [row] = await this.db
      .select()
      .from(homeContent)
      .where(eq(homeContent.id, 1));
    return row
      ? { ...row.content, updatedAt: row.updatedAt.toISOString() }
      : null;
  }

  /** First run: import the old data/home.json if it exists, else defaults. */
  private async initialContent(): Promise<Omit<HomeContent, 'updatedAt'>> {
    try {
      const legacy: unknown = JSON.parse(await readFile(LEGACY_STORE, 'utf8'));
      const content = sanitize(legacy);
      this.logger.log('Imported homepage content from data/home.json');
      return content;
    } catch {
      return structuredClone(HOME_DEFAULTS);
    }
  }
}
