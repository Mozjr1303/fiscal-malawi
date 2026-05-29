import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.update({
    where: { email: 'admin@gmail.com' },
    data: { password: hashedPassword }
  });
  console.log('Password for admin@gmail.com reset to: admin123');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
