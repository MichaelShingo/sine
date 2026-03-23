import { list } from '@/app/lib/api/services/users';
import {
  queryUserSchema,
  usersResponseSchema,
} from '@/app/lib/api/validation/users';
import { NextRequest } from 'next/server';
import { ok } from '@/app/lib/api/https';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = queryUserSchema.parse(Object.fromEntries(searchParams));
  const result = await list(query);

  return ok(usersResponseSchema.parse(result));
}
