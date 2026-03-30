import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { sampleContracts } from './seed-contracts';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const SEED_USER = {
  id: 'cmn17555d0000wszdqpdjgwpa',
  name: 'Michael Shingo Crawford',
  email: 'michaelshingotokyo@gmail.com',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocK6jJzYVnkEze_WpOIo1sM2Qf9FACJVZb_9oPS4TvKS3OfqWQ=s96-c',
  createdAt: new Date('2026-03-22T03:27:47.281Z'),
  updatedAt: new Date('2026-03-22T03:27:47.281Z'),
} as const;

export async function main() {
  const user = await prisma.user.upsert({
    where: { id: SEED_USER.id },
    create: {
      id: SEED_USER.id,
      name: SEED_USER.name,
      email: SEED_USER.email,
      image: SEED_USER.image,
    },
    update: {
      name: SEED_USER.name,
      email: SEED_USER.email,
      image: SEED_USER.image,
    },
  });

  await prisma.contract.deleteMany({ where: { userId: user.id } });

  await prisma.contract.createMany({
    data: sampleContracts.map((c) => ({
      ...c,
      userId: user.id,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
