/*
  Warnings:

  - You are about to drop the column `templateId` on the `Calendar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Calendar" DROP CONSTRAINT "Calendar_templateId_fkey";

-- AlterTable
ALTER TABLE "Calendar" DROP COLUMN "templateId";
