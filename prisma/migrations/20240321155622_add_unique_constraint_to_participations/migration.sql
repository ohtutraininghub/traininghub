/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `Participation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_courseId_key" ON "Participation"("userId", "courseId");
