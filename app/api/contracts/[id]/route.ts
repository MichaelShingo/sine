import {
  badRequest,
  forbidden,
  noContent,
  notFound,
  ok,
  unauthorized,
} from '@/app/lib/api/https';
import { updateContractSchema } from '@/app/lib/api/validation/contracts';
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
    return badRequest('Invalid contract id');
  }

  const contract = await prisma.contract.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!contract) {
    return notFound('Contract not found');
  }

  if (contract?.userId !== session.user?.id) {
    return forbidden('You do not have permission to view this contract.');
  }

  return ok(contract);
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

  const validated = validateBody(body, updateContractSchema);

  if (!validated.ok) {
    return validated.response;
  }

  if (Object.keys(validated.data).length === 0) {
    return badRequest('No fields to update');
  }

  const existing = await prisma.contract.findUnique({
    where: { id: Number(id) },
    select: { userId: true },
  });

  if (!existing) {
    return notFound('Contract not found');
  }

  if (existing.userId !== userId) {
    return forbidden('You do not have permission to update this contract.');
  }

  const updatedContract = await prisma.contract.update({
    where: { id: Number(id) },
    data: validated.data as Prisma.ContractUncheckedUpdateInput,
  });

  return ok(updatedContract);
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

  await prisma.contract.delete({
    where: {
      id: Number(id),
    },
  });

  return noContent();
}
