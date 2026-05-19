-- CreateEnum
CREATE TYPE "LdlGroup" AS ENUM ('NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "FoodStatus" AS ENUM ('OPTIMAL', 'NEUTRAL', 'LIMIT');

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "proteins" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodClassification" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "ldlGroup" "LdlGroup" NOT NULL,
    "status" "FoodStatus" NOT NULL,
    "isRecommended" BOOLEAN NOT NULL,

    CONSTRAINT "FoodClassification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodClassification_foodId_ldlGroup_key" ON "FoodClassification"("foodId", "ldlGroup");

-- AddForeignKey
ALTER TABLE "FoodClassification" ADD CONSTRAINT "FoodClassification_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;
