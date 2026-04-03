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
  id: 'cmndtm2q40000kozd5jvxinpf',
  name: 'Michael Shingo Crawford',
  email: 'mcrawford5376@gmail.com',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocJXG6xZ-Wwgj-uJYyrP3v21ewqljn2vZho51yo9F7qHU5ItTmfEmA=s96-c',
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
