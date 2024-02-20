-- CreateTable
CREATE TABLE "CommunityThread" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "section" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "communityThreadSlug" TEXT NOT NULL,

    CONSTRAINT "CommunityThread_pkey" PRIMARY KEY ("id")
);
