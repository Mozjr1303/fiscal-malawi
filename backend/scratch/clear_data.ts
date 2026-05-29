import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.anomaly.deleteMany({});
  await prisma.transaction.deleteMany({});
  console.log('Successfully cleared all simulated transactions and anomalies.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
