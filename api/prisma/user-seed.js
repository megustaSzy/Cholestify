import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
import { ROLE } from "../src/constants/role.constant.js";
import { generatePatientCode } from "../src/utils/generate-patient-code.util.js";

async function main() {
  const dummyUsers = [
    {
      nama: "user",
      email: "user@gmail.com",
      notelp: "081234567899",
      password: "password123",
    },
  ];

  for (const user of dummyUsers) {
    const existUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existUser) {
      console.log(`User ${user.email} already exists. Skipping...`);
      continue; // Lewati jika sudah ada
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    let createdUser;

    for (let i = 0; i < 5; i++) {
      try {
        createdUser = await prisma.user.create({
          data: {
            patientId: generatePatientCode(),
            nama: user.nama,
            email: user.email,
            password: hashedPassword,
            notelp: user.notelp,
            role: ROLE.USER,
          },
        });
        break;
      } catch (error) {
        if (error.code === "P2002") {
          continue;
        }
        throw error;
      }
    }

    if (createdUser) {
      console.log(`User ${user.nama} (${user.email}) created successfully.`);
    } else {
      console.log(`Failed to create user ${user.nama}.`);
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
