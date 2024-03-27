import { coursesWithStartDateBetweenDates } from '../prisma/courses';
import { sendReminderToUsers } from '../slack';

const createDate = (days: number) => {
  const startDateStart = new Date();
  startDateStart.setDate(startDateStart.getDate() + days);
  startDateStart.setHours(0, 1, 0, 0);
  const startDateEnd = new Date();
  startDateEnd.setDate(startDateStart.getDate() + days);
  startDateEnd.setHours(23, 59, 59, 999);
  return { startDateStart, startDateEnd };
};

const sendNotificationsBeforeCourseStart = async () => {
  const threeDays = createDate(3);
  const oneDay = createDate(1);
  const coursesInThreeDays = await coursesWithStartDateBetweenDates(
    threeDays.startDateStart,
    threeDays.startDateEnd
  );
  coursesInThreeDays.forEach((course) => {
    const emails = course.students.map((student) => student.email);
    if (Array.isArray(emails) && emails.every((email) => email !== null)) {
      sendReminderToUsers(course, emails as string[], '3 days');
    }
  });
  const coursesInOneDay = await coursesWithStartDateBetweenDates(
    oneDay.startDateStart,
    oneDay.startDateEnd
  );
  coursesInOneDay.forEach((course) => {
    const emails = course.students.map((student) => student.email);
    if (Array.isArray(emails) && emails.every((email) => email !== null)) {
      sendReminderToUsers(course, emails as string[], '1 day');
    }
  });
};

export default sendNotificationsBeforeCourseStart;
