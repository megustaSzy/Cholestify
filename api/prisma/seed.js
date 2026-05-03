import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
import { ROLE } from "../src/constants/role.constant.js";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const notelp = process.env.ADMIN_NOTELP;

  const existAdmin = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existAdmin) {
    console.log("Admin already exist");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      nama: "Admin",
      email,
      password: hashedPassword,
      notelp,
      role: ROLE.ADMIN,
    },
  });

  console.log("Admin created succesfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect;
  });
