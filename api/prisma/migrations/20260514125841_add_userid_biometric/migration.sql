/*
  Warnings:

  - You are about to drop the column `profileId` on the `Biometric` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Screening` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Biometric` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Biometric` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Biometric" DROP CONSTRAINT "Biometric_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_profileId_fkey";

-- DropIndex
DROP INDEX "Biometric_profileId_key";

-- AlterTable
ALTER TABLE "Biometric" DROP COLUMN "profileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "profileId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "Biometric_userId_key" ON "Biometric"("userId");

-- AddForeignKey
ALTER TABLE "Biometric" ADD CONSTRAINT "Biometric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
