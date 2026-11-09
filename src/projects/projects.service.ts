import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { and, asc, count, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service.js';
import { projects, projectsSettings } from '../database/schema.js';
import {
  PROJECT_DEFAULTS,
  PROJECTS_SETTINGS_DEFAULTS,
} from './projects.defaults.js';
import type {
  Project,
  ProjectInput,
  ProjectsSettings,
} from './projects.types.js';
import {
  sanitizeProject,
  sanitizeProjectsSettings,
} from './projects.validate.js';

type Row = typeof projects.$inferSelect;

function toProject(row: Row): Project {
  return {
    ...row.data,
    id: row.id,
    slug: row.slug,
    status: row.status,
    position: row.position,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function split({ slug, status, ...data }: ProjectInput) {
  return { slug, status, data };
}

function isDuplicate(err: unknown): boolean {
  const e = err as { code?: string; cause?: { code?: string } };
  return e?.code === '23505' || e?.cause?.code === '23505';
}

const ordered = [asc(projects.position), asc(projects.id)];

@Injectable()
export class ProjectsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  async onApplicationBootstrap() {
    const [{ total }] = await this.db.select({ total: count() }).from(projects);
    if (total > 0) return;
    await this.db
      .insert(projects)
      .values(PROJECT_DEFAULTS.map((p, i) => ({ ...split(p), position: i })))
      .onConflictDoNothing();
    this.logger.log(`Seeded ${PROJECT_DEFAULTS.length} sample projects`);
  }

  /* ---------- Settings ---------- */

  async settings(): Promise<ProjectsSettings> {
    const [row] = await this.db
      .select()
      .from(projectsSettings)
      .where(eq(projectsSettings.id, 1));
    return row?.data ?? PROJECTS_SETTINGS_DEFAULTS;
  }

  async updateSettings(input: unknown): Promise<ProjectsSettings> {
    const data = sanitizeProjectsSettings(input);
    await this.db
      .insert(projectsSettings)
      .values({ id: 1, data })
      .onConflictDoUpdate({
        target: projectsSettings.id,
        set: { data, updatedAt: new Date() },
      });
    return data;
  }

  /* ---------- Projects ---------- */

  async published(): Promise<Project[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .where(eq(projects.status, 'published'))
      .orderBy(...ordered);
    return rows.map(toProject);
  }

  async publishedBySlug(slug: string): Promise<Project> {
    const [row] = await this.db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, 'published')));
    if (!row) throw new NotFoundException('Project not found');
    return toProject(row);
  }

  async all(): Promise<Project[]> {
    const rows = await this.db
      .select()
      .from(projects)
      .orderBy(...ordered);
    return rows.map(toProject);
  }

  async byId(id: number): Promise<Project> {
    const [row] = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id));
    if (!row) throw new NotFoundException('Project not found');
    return toProject(row);
  }

  async create(input: unknown): Promise<Project> {
    const project = sanitizeProject(input);
    const [row] = await this.unique(project.slug, () =>
      this.db
        .insert(projects)
        .values({
          ...split(project),
          // New projects go to the top of the list.
          position: sql`(select coalesce(min(${projects.position}), 1) - 1 from ${projects})`,
        })
        .returning(),
    );
    return toProject(row);
  }

  async update(id: number, input: unknown): Promise<Project> {
    const project = sanitizeProject(input);
    const [row] = await this.unique(project.slug, () =>
      this.db
        .update(projects)
        .set({ ...split(project), updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning(),
    );
    if (!row) throw new NotFoundException('Project not found');
    return toProject(row);
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id });
    if (!deleted.length) throw new NotFoundException('Project not found');
  }

  async reorder(input: unknown): Promise<Project[]> {
    const ids = (input as { ids?: unknown })?.ids;
    const existing = await this.all();
    if (
      !Array.isArray(ids) ||
      ids.length !== existing.length ||
      new Set(ids).size !== ids.length ||
      !existing.every((p) => ids.includes(p.id))
    ) {
      throw new BadRequestException('ids must list every project once');
    }
    await this.db.transaction(async (tx) => {
      for (const [position, id] of (ids as number[]).entries()) {
        await tx.update(projects).set({ position }).where(eq(projects.id, id));
      }
    });
    return this.all();
  }

  private async unique<T>(slug: string, run: () => Promise<T>): Promise<T> {
    try {
      return await run();
    } catch (err) {
      if (isDuplicate(err)) {
        throw new ConflictException(`The slug "${slug}" is already used`);
      }
      throw err;
    }
  }
}
