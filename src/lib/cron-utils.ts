import { coursesWithStartDateBetweenDates } from './prisma/courses';
import { sendReminderToUsers } from './slack';

const sendNotificationsBeforeCourseStart = async () => {
  const startDateStart = new Date();
  startDateStart.setDate(startDateStart.getDate() + 3);
  startDateStart.setHours(0, 1, 0, 0);
  const startDateEnd = new Date();
  startDateEnd.setDate(startDateStart.getDate() + 3);
  startDateEnd.setHours(23, 59, 59, 999);
  const courses = await coursesWithStartDateBetweenDates(
    startDateStart,
    startDateEnd
  );
  courses.forEach((course) => {
    const emails = course.students.map((student) => student.email);
    if (Array.isArray(emails) && emails.every((email) => email !== null)) {
      sendReminderToUsers(course, emails as string[]);
    } else {
      sendReminderToUsers(course, emails as string[]);
    }
  });
};

export default sendNotificationsBeforeCourseStart;
