-- CreateTable
CREATE TABLE "GoogleCalendar" (
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleCalendar_userId_courseId_key" ON "GoogleCalendar"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoogleCalendar" ADD CONSTRAINT "GoogleCalendar_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
