import { prisma } from "../src/lib/prisma.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Menjalankan seeder untuk Food & FoodClassification...");

  try {
    const masterPath = path.join(__dirname, "../food_master.json");
    const highPath = path.join(__dirname, "../food_classification_HIGH.json");
    const normalPath = path.join(
      __dirname,
      "../food_classification_NORMAL.json",
    );

    const foodMasterData = JSON.parse(await fs.readFile(masterPath, "utf-8"));
    const foodHighData = JSON.parse(await fs.readFile(highPath, "utf-8"));
    const foodNormalData = JSON.parse(await fs.readFile(normalPath, "utf-8"));

    console.log(`Menginsert ${foodMasterData.length} data Food Master...`);

    for (const item of foodMasterData) {
      await prisma.food.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          calories: item.calories,
          proteins: item.proteins,
          fat: item.fat,
        },
        create: {
          id: item.id,
          name: item.name,
          calories: item.calories,
          proteins: item.proteins,
          fat: item.fat,
        },
      });
    }

    console.log("Food Master berhasil di-insert!");

    const classifications = [];

    foodHighData.foods.forEach((item) => {
      classifications.push({
        foodId: item.id,
        ldlGroup: "HIGH",
        status: item.status,
        isRecommended: item.is_recommended === 1,
      });
    });

    foodNormalData.foods.forEach((item) => {
      classifications.push({
        foodId: item.id,
        ldlGroup: "NORMAL",
        status: item.status,
        isRecommended: item.is_recommended === 1,
      });
    });

    console.log(
      `Menginsert ${classifications.length} data Food Classification...`,
    );

    await prisma.foodClassification.deleteMany({});

    await prisma.foodClassification.createMany({
      data: classifications,
    });

    console.log("Proses Seeding Selesai Semua!");
  } catch (error) {
    console.error("Error saat seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
