import { Course } from '@prisma/client';

interface Props {
  headerText: string;
  courses: Course[];
}

export default async function ProfileCourseList({
  headerText,
  courses,
}: Props) {
  return (
    <div>
      <h5>{headerText}</h5>
      <ul>
        {courses.map((course: Course) => (
          <li key={course.id}>
            {course.name} <br />
            {course.startDate.toDateString()} <br />
            {course.endDate.toDateString()} <br />
          </li>
        ))}
      </ul>
    </div>
  );
}
