import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();
  console.log('Users:', users);
}

main().catch(console.error);
