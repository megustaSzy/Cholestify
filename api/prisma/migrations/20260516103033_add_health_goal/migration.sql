-- CreateTable
CREATE TABLE "HealthGoal" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "targetLdlHdlRatio" DOUBLE PRECISION NOT NULL,
    "targetWeeklyCalories" INTEGER NOT NULL,
    "targetExerciseMins" INTEGER NOT NULL,
    "dietaryAdvice" TEXT NOT NULL,
    "activityAdvice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthGoal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthGoal" ADD CONSTRAINT "HealthGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
