import { Prisma } from '@/app/generated/prisma/client';
import { created, ok, unauthorized } from '@/app/lib/api/https';
import {
  createTemplateSchema,
  getTemplateSchema,
} from '@/app/lib/api/validation/templates';
import { validateBody, validateSearchParams } from '@/app/lib/api/validation/utils';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function CREATE(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return unauthorized();
  }

  const body = await req.json();

  const validated = validateBody(body, createTemplateSchema);

  if (!validated.ok) {
    return validated.response;
  }

  const { content, ...rest } = validated.data;

  const template = await prisma.template.create({
    data: {
      userId: session.user.id,
      content: content as Prisma.InputJsonValue,
      ...rest,
    },
  });

  return created(template);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return unauthorized();
  }

  const validated = validateSearchParams(req.nextUrl.searchParams, getTemplateSchema);

  if (!validated.ok) {
    return validated.response;
  }

  const { searchTerm, sortBy, sortDir } = validated.data;

  const where: Prisma.TemplateWhereInput = {
    userId: session.user.id,
  };

  const query = searchTerm?.trim();

  if (query) {
    where.OR = [{ name: { contains: query, mode: 'insensitive' } }];
  }

  const templates = await prisma.template.findMany({
    where,
    orderBy: [
      { [sortBy]: sortDir } as Prisma.TemplateOrderByWithRelationInput,
      { id: 'asc' },
    ],
  });

  return ok(templates);
}
