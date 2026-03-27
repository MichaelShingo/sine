import { notFound, noContent, ok, unauthorized } from '@/app/lib/api/https';
import { validateBody } from '@/app/lib/api/validation/utils';
import { updateUserSchema } from '@/app/lib/api/validation/users';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { createContractSchema } from '@/app/lib/api/validation/contracts';
import { Prisma } from '@/app/generated/prisma/client';

export async function CREATE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return unauthorized();
  }

  const body = await req.json();

  const validated = validateBody(body, createContractSchema);

  if (!validated.ok) {
    return validated.response;
  }

  const contract = await prisma.contract.create({
    data: validated.data as Prisma.ContractCreateInput,
  });
}
