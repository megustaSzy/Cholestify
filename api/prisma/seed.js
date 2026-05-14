import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

import { ROLE } from "../src/constants/role.constant.js";

import { generatePatientCode } from "../src/utils/generate-patient-code.util.js";

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

  let admin;

  for (let i = 0; i < 5; i++) {
    try {
      admin = await prisma.user.create({
        data: {
          patientId: generatePatientCode(),

          nama: "Admin",

          email,

          password: hashedPassword,

          notelp,

          role: ROLE.ADMIN,
        },
      });

      break;
    } catch (error) {
      // retry jika patientId duplicate
      if (error.code === "P2002") {
        continue;
      }

      throw error;
    }
  }

  if (!admin) {
    throw new Error("Failed generate patient ID");
  }

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
