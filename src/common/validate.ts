import { BadRequestException } from '@nestjs/common';

// Small hand-rolled validators that report the failing field path, e.g. "tables[0].rows[3].Price".

export type Obj = Record<string, unknown>;

export function obj(v: unknown, path: string): Obj {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new BadRequestException(`${path} must be an object`);
  }
  return v as Obj;
}

export function str(
  v: unknown,
  path: string,
  max: number,
  required = true,
): string {
  if (v === undefined && !required) return '';
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

/** Internal path ("/x", not "//x") or absolute http(s) URL. */
export function href(v: unknown, path: string, required = true): string {
  const s = str(v, path, 300, required);
  if (!s) return s;
  if (!/^\/(?!\/)/.test(s) && !/^https?:\/\//i.test(s)) {
    throw new BadRequestException(`${path} must start with / or http(s)://`);
  }
  return s;
}

export function arr(v: unknown, path: string, max: number): unknown[] {
  if (!Array.isArray(v)) {
    throw new BadRequestException(`${path} must be a list`);
  }
  if (v.length > max) {
    throw new BadRequestException(`${path} can have at most ${max} items`);
  }
  return v;
}

export function oneOf<T extends string>(
  v: unknown,
  list: readonly T[],
  path: string,
): T {
  if (typeof v !== 'string' || !(list as readonly string[]).includes(v)) {
    throw new BadRequestException(`${path} must be one of ${list.join(', ')}`);
  }
  return v as T;
}

export function bool(v: unknown, path: string): boolean {
  if (typeof v !== 'boolean') {
    throw new BadRequestException(`${path} must be true or false`);
  }
  return v;
}
