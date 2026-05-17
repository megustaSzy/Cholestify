/*
  Warnings:

  - You are about to drop the column `activityAdvice` on the `HealthGoal` table. All the data in the column will be lost.
  - You are about to drop the column `dietaryAdvice` on the `HealthGoal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HealthGoal" DROP COLUMN "activityAdvice",
DROP COLUMN "dietaryAdvice";
