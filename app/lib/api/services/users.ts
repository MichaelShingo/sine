import { Prisma } from '@/app/generated/prisma/client';
import { GetUsersInput, UsersResponse } from '../validation/users';
import prisma from '@/lib/prisma';

export async function list(query: GetUsersInput): Promise<UsersResponse> {
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.UserWhereInput = {
    ...(query.name && { name: { contains: query.name, mode: 'insensitive' } }),
    ...(query.email && { email: { contains: query.email } }),
  };

  const orderBy: Prisma.UserOrderByWithRelationInput[] = [
    { [query.sortBy]: query.sortDir },
  ];

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take: query.limit + 1,
      ...(query.cursor && { cursor: { id: query.cursor }, skip: 1 }),
    }),
    prisma.user.count({ where }),
  ]);

  const hasNext = data.length > query.limit;
  const nextCursor = hasNext ? data.pop()!.id : null;

  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
      hasNext,
      cursor: nextCursor,
    },
  };
}
