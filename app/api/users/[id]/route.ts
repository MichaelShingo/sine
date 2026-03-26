import { notFound, noContent, ok, unauthorized } from '@/app/lib/api/https';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const { id } = await params;

  if (session?.user?.id !== id) {
    return unauthorized('You cannot fetch users other than yourself.');
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return notFound('User not found');
  }

  return ok(user);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const body = await req.json();
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: body,
  });

  if (!user) return notFound('User not found');

  return ok(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  if (!deletedUser) {
    return notFound('User not found');
  }

  return noContent();
}
