-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bannerType" "BannerType";
