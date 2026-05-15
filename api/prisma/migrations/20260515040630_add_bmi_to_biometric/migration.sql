/*
  Add BMI fields to Biometric table.
  - Adds bmi and bmiCategory with default values first.
  - Updates existing rows by calculating BMI from height and weight.
  - Then removes the default values.
*/

-- AlterTable: Add columns with default values to handle existing rows
ALTER TABLE "Biometric" ADD COLUMN     "bmi" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "bmiCategory" TEXT NOT NULL DEFAULT 'Normal';

-- Update existing rows: calculate BMI = weight / (height/100)^2
UPDATE "Biometric"
SET
  "bmi" = ROUND(CAST("weight" / POWER("height" / 100, 2) AS NUMERIC), 1),
  "bmiCategory" = CASE
    WHEN "weight" / POWER("height" / 100, 2) < 18.5 THEN 'Underweight'
    WHEN "weight" / POWER("height" / 100, 2) < 25 THEN 'Normal'
    WHEN "weight" / POWER("height" / 100, 2) < 30 THEN 'Overweight'
    ELSE 'Obese'
  END;

-- Remove default values
ALTER TABLE "Biometric" ALTER COLUMN "bmi" DROP DEFAULT,
ALTER COLUMN "bmiCategory" DROP DEFAULT;
