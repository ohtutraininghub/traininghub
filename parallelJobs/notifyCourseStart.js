import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const SLACK_API_POST_MESSAGE = 'https://slack.com/api/chat.postMessage';

const isProduction = () => 'true';

isProduction();

cron.schedule('* * * * *', () => {
  sendNotificationsBeforeCourseStart();
});

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
      sendReminderToUsers(course, emails);
    }
  });
};

const coursesWithStartDateBetweenDates = async (
  startDateStart,
  startDateEnd
) => {
  const coursesWithStudents = await prisma.course.findMany({
    where: {
      startDate: {
        gte: startDateStart,
        lte: startDateEnd,
      },
    },
    include: {
      students: {
        select: {
          email: true,
        },
      },
    },
  });

  return coursesWithStudents;
};

// Why like this?
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

const sendMessage = async (channel, blocks) => {
  // Channel can be a user id or a channel id/name
  const payload = {
    channel: channel,
    blocks: blocks,
  };

  await fetch(SLACK_API_POST_MESSAGE, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

const sendMessageToUser = async (userEmail, blocks) => {
  const userId = await findUserIdByEmail(userEmail);
  if (!userId) return;
  await sendMessage(userId, blocks);
};

const sendReminderToUsers = (course, emails) => {
  emails.forEach((email) => {
    const message = createBlocksCourseReminder(course);
    sendMessageToUser(email, message);
  });
};

const createBlocksCourseReminder = (course) => {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Training Reminder :alarm_clock:',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*<${process.env.HOST_URL}/en?courseId=${course.id}|${course.name}>* is starting soon!`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':calendar:',
        },
        {
          type: 'mrkdwn',
          text: formatDateRangeForSlack(course.startDate, course.endDate),
        },
      ],
    },
  ];
};
