-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canDeleteEntries" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditEntries" BOOLEAN NOT NULL DEFAULT false;
