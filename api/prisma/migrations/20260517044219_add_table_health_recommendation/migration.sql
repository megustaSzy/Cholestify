/*
  Warnings:

  - Added the required column `triglycerides` to the `LipidPanel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RecommendationTrigger" AS ENUM ('LIPID_PANEL', 'MANUAL');

-- AlterTable
ALTER TABLE "LipidPanel" ADD COLUMN     "triglycerides" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "HealthRecommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lipidPanelId" INTEGER,
    "dietaryAdvice" TEXT NOT NULL,
    "activityAdvice" TEXT NOT NULL,
    "triggerSource" "RecommendationTrigger" NOT NULL DEFAULT 'LIPID_PANEL',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthRecommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthRecommendation" ADD CONSTRAINT "HealthRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthRecommendation" ADD CONSTRAINT "HealthRecommendation_lipidPanelId_fkey" FOREIGN KEY ("lipidPanelId") REFERENCES "LipidPanel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
