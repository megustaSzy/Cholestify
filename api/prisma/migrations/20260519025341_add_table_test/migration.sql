-- CreateTable
CREATE TABLE "TestUpload" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestUpload_pkey" PRIMARY KEY ("id")
);
