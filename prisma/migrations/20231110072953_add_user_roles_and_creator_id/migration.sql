-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'TRAINEE', 'TRAINER');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'TRAINEE';

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
