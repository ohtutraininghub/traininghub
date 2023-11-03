-- CreateTable
CREATE TABLE "Calendar" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "googleEventId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_userId_courseId_key" ON "Calendar"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
