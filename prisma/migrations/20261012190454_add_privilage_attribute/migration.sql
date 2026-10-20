-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "privilages" TEXT[] DEFAULT ARRAY[]::TEXT[];
