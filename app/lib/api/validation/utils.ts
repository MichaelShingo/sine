import { unprocessable } from '@/app/lib/api/https';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export type ParseValidatedBodyResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Validates `body` with a Zod schema. On failure, returns a 422 response
 * suitable for returning from a route handler.
 */
export function validateBody<S extends z.ZodType>(
  body: unknown,
  schema: S,
): ParseValidatedBodyResult<z.infer<S>> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: unprocessable(parsed.error.message) };
  }
  return { ok: true, data: parsed.data };
}

/**
 * Validates query string values with a Zod schema. Empty string values are
 * omitted so optional fields and `.default()` apply as for missing keys.
 */
export function validateSearchParams<S extends z.ZodType>(
  searchParams: URLSearchParams,
  schema: S,
): ParseValidatedBodyResult<z.infer<S>> {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value !== '') raw[key] = value;
  });
  return validateBody(raw, schema);
}
