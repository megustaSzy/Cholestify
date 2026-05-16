/*
  Warnings:

  - The values [INDICATION,SEVERE] on the enum `ScreeningResult` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ScreeningResult_new" AS ENUM ('NORMAL', 'INDIKASI_RINGAN', 'INDIKASI_KUAT');
ALTER TABLE "Screening" ALTER COLUMN "result" TYPE "ScreeningResult_new" USING ("result"::text::"ScreeningResult_new");
ALTER TYPE "ScreeningResult" RENAME TO "ScreeningResult_old";
ALTER TYPE "ScreeningResult_new" RENAME TO "ScreeningResult";
DROP TYPE "public"."ScreeningResult_old";
COMMIT;
