-- CreateTable
CREATE TABLE "LipidPanel" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalCholesterol" DOUBLE PRECISION NOT NULL,
    "triglycerides" DOUBLE PRECISION NOT NULL,
    "ldl" DOUBLE PRECISION NOT NULL,
    "hdl" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LipidPanel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LipidPanel_userId_key" ON "LipidPanel"("userId");

-- AddForeignKey
ALTER TABLE "LipidPanel" ADD CONSTRAINT "LipidPanel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
