-- CreateTable
CREATE TABLE "CodingProfile" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profileUrl" TEXT,
    "iconUrl" TEXT,
    "rating" INTEGER,
    "badge" TEXT,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodingProfile" ADD CONSTRAINT "CodingProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
