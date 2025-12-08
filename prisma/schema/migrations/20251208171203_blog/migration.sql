-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('TECHNOLOGY', 'PROGRAMMING', 'LIFESTYLE', 'TUTORIAL', 'NEWS');

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "serialNo" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "category" "BlogCategory" NOT NULL,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);
