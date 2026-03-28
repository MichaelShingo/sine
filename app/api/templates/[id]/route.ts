import {
  badRequest,
  forbidden,
  noContent,
  notFound,
  ok,
  unauthorized,
} from '@/app/lib/api/https';
import { updateTemplateSchema } from '@/app/lib/api/validation/templates';
import { validateBody } from '@/app/lib/api/validation/utils';
import { auth } from '@/auth';
import type { Prisma } from '@/app/generated/prisma/client';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  const { id } = await params;

  if (id === null) {
    return badRequest('Invalid template id');
  }

  const template = await prisma.template.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      contracts: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!template) {
    return notFound('Template not found');
  }

  if (template?.userId !== session.user?.id) {
    return forbidden('You do not have permission to view this template.');
  }

  return ok(template);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  const userId = session.user?.id;
  if (!userId) {
    return unauthorized();
  }

  const { id } = await params;

  const body = await req.json();

  const validated = validateBody(body, updateTemplateSchema);

  if (!validated.ok) {
    return validated.response;
  }

  if (Object.keys(validated.data).length === 0) {
    return badRequest('No fields to update');
  }

  const existing = await prisma.template.findUnique({
    where: { id: Number(id) },
    select: { userId: true },
  });

  if (!existing) {
    return notFound('Template not found');
  }

  if (existing.userId !== userId) {
    return forbidden('You do not have permission to update this template.');
  }

  const updatedTemplate = await prisma.template.update({
    where: { id: Number(id) },
    data: validated.data as Prisma.TemplateUncheckedUpdateInput,
  });

  return ok(updatedTemplate);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  const userId = session.user?.id;
  if (!userId) {
    return unauthorized();
  }

  const { id } = await params;

  await prisma.template.delete({
    where: {
      id: Number(id),
    },
  });

  return noContent();
}
