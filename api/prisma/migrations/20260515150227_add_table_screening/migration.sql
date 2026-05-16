/*
  Warnings:

  - Added the required column `description` to the `Screening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommendation` to the `Screening` table without a default value. This is not possible if the table is not empty.
  - Made the column `confidence` on table `Screening` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "probabilities" JSONB,
ADD COLUMN     "recommendation" TEXT NOT NULL,
ALTER COLUMN "confidence" SET NOT NULL;
