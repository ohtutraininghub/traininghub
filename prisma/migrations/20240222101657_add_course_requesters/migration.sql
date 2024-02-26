-- CreateTable
CREATE TABLE "_requestedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_requestedCourses_AB_unique" ON "_requestedCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_requestedCourses_B_index" ON "_requestedCourses"("B");

-- AddForeignKey
ALTER TABLE "_requestedCourses" ADD CONSTRAINT "_requestedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_requestedCourses" ADD CONSTRAINT "_requestedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
