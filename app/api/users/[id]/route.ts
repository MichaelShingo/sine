import { notFound, noContent, ok, forbidden } from '@/app/lib/api/https';
import { validateBody } from '@/app/lib/api/validation/utils';
import { updateUserSchema } from '@/app/lib/api/validation/users';
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
    return forbidden('You cannot fetch users other than yourself.');
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
  const session = await auth();
  const { id } = await params;

  if (session?.user?.id !== id) {
    return forbidden('You cannot edit users other than yourself.');
  }

  const body = await req.json();
  const validated = validateBody(body, updateUserSchema);

  if (!validated.ok) {
    return validated.response;
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: validated.data,
  });

  if (!user) return notFound('User not found');

  return ok(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const { id } = await params;

  if (session?.user?.id !== id) {
    return forbidden('You cannot delete users other than yourself.');
  }
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
