import { unauthorized, created, ok } from '@/app/lib/api/https';
import {
  validateBody,
  validateSearchParams,
} from '@/app/lib/api/validation/utils';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';
import {
  createContractSchema,
  getContractSchema,
} from '@/app/lib/api/validation/contracts';
import { Prisma } from '@/app/generated/prisma/client';

export async function CREATE(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return unauthorized();
  }

  const body = await req.json();

  const validated = validateBody(body, createContractSchema);

  if (!validated.ok) {
    return validated.response;
  }

  const { content, ...rest } = validated.data;

  const contract = await prisma.contract.create({
    data: {
      userId: session.user.id,
      content: content as Prisma.InputJsonValue,
      ...rest,
    },
  });

  return created(contract);
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return unauthorized();
  }

  const validated = validateSearchParams(
    req.nextUrl.searchParams,
    getContractSchema,
  );
  if (!validated.ok) {
    return validated.response;
  }

  const {
    searchTerm,
    deadlineIsBefore,
    deadlineIsAfter,
    signedDateIsBefore,
    signedDateIsAfter,
    isSent,
    templateId,
    limit,
    page,
    sortBy,
    sortDir,
  } = validated.data;

  const where: Prisma.ContractWhereInput = {
    userId: session.user.id,
  };

  if (typeof isSent === 'boolean') {
    where.isSent = isSent;
  }

  if (templateId !== undefined) {
    where.templateId = templateId;
  }

  if (deadlineIsBefore !== undefined || deadlineIsAfter !== undefined) {
    where.deadline = {};
    if (deadlineIsBefore !== undefined) {
      where.deadline.lt = deadlineIsBefore;
    }
    if (deadlineIsAfter !== undefined) {
      where.deadline.gt = deadlineIsAfter;
    }
  }

  if (signedDateIsBefore !== undefined || signedDateIsAfter !== undefined) {
    where.signedDate = {};
    if (signedDateIsBefore !== undefined) {
      where.signedDate.lt = signedDateIsBefore;
    }
    if (signedDateIsAfter !== undefined) {
      where.signedDate.gt = signedDateIsAfter;
    }
  }

  const query = searchTerm?.trim();
  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { signerName: { contains: query, mode: 'insensitive' } },
      { signerEmail: { contains: query, mode: 'insensitive' } },
    ];
  }

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: [
        { [sortBy]: sortDir } as Prisma.ContractOrderByWithRelationInput,
        { id: 'asc' },
      ],
    }),
    prisma.contract.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return ok({
    data: contracts,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      cursor: validated.data.cursor ?? null,
    },
  });
}
