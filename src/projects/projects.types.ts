import type { SeoFields } from '../common/seo.js';

export const PROJECT_STATUSES = ['draft', 'published'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectData {
  /** The project's h1. */
  title: string;
  /** Short text under the h1 and on project cards. */
  summary: string;
  /** Markdown-like text, same syntax as blog posts. */
  body: string;
  image: string;
  imageAlt: string;
  gallery: { image: string; alt: string }[];
  client: string;
  location: string;
  /** "YYYY" or empty. */
  year: string;
  /** Product names supplied, e.g. ["Rebar", "Wire rod"]. */
  products: string[];
  /** Key figures, e.g. { label: "Tonnage", value: "12,000 t" }. */
  facts: { label: string; value: string }[];
  seo: SeoFields;
}

export interface ProjectInput extends ProjectData {
  slug: string;
  status: ProjectStatus;
}

export interface Project extends ProjectInput {
  id: number;
  position: number;
  updatedAt: string;
}

export interface ProjectsSettings {
  h1: string;
  intro: string;
  seo: SeoFields;
}
