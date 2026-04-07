import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.rating.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.serviceCategory.deleteMany();

  await prisma.user.create({
    data: {
      name: "Altum Master Admin",
      email: "contatoaltumsistemas@gmail.com",
      phone: "(11) 90000-0001",
      passwordHash,
      role: UserRole.admin,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
