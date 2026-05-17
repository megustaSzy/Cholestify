/*
  Warnings:

  - You are about to drop the column `triglycerides` on the `LipidPanel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LipidPanel" DROP COLUMN "triglycerides",
ADD COLUMN     "date" TIMESTAMP(3);
