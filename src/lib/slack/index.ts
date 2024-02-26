import { Course } from '@prisma/client';
import { dateToUnixTimestamp } from '@/lib/timedateutils';

interface Block {
  type: string;
  text?: {
    type: string;
    text?: string;
    emoji?: boolean;
  };
}

const token = process.env.SLACK_BOT_TOKEN;

export const sendMessageToUser = async (userEmail: string, blocks: Block[]) => {
  const userId = await findUserIdByEmail(userEmail);
  await sendMessage(userId, blocks);
};

export const sendMessage = async (channel: string, blocks: Block[]) => {
  // Channel can be a user id or a channel id/name
  const payload = {
    channel: channel,
    blocks: blocks,
  };

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

export const sendFullCourseMessage = async (
  userEmail: string,
  course: Course
) => {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Your course is full! :tada:',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*<https://google.com|${course.name}>* has reached full capacity *(${course.maxStudents}/${course.maxStudents})*`,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: '🕒',
        },
        {
          type: 'mrkdwn',
          text: '20.8.2024 09.00 - 21.8.2024 15.00',
        },
      ],
    },
  ];
  sendMessageToUser(userEmail, blocks);
};

const findUserIdByEmail = async (email: string) => {
  const res = await fetch(
    `https://slack.com/api/users.lookupByEmail?email=${email}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );
  const data = await res.json();
  return data.user.id;
};

export const sendCoursePoster = async (course: Course) => {
  const dateRange = formatDateRangeForSlack(course.startDate, course.endDate);
  const message = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*New Training Available!* :tada:',
      },
    },
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: course.name,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: course.summary || course.description,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':busts_in_silhouette:',
        },
        {
          type: 'mrkdwn',
          text: `${course.maxStudents} spots`,
        },
      ],
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
          text: dateRange,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':link:',
        },
        {
          type: 'mrkdwn',
          text: `*Enroll now:* <${process.env.HOST_URL}/en?courseId=${course.id}|${course.name}>`,
        },
      ],
    },
  ];
  if (course.lastEnrollDate) {
    message.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':bangbang:',
        },
        {
          type: 'mrkdwn',
          text: `*Do it before:* <!date^${dateToUnixTimestamp(
            course.lastEnrollDate
          )}^{date_short} {time}|${course.lastEnrollDate.toLocaleDateString()}>`,
        },
      ],
    });
  }
  const channel = 'new-trainings';
  await sendMessage(channel, message);
};

const formatDateRangeForSlack = (startDate: Date, endDate: Date) => {
  const startDateUnix = dateToUnixTimestamp(startDate);
  const endDateUnix = dateToUnixTimestamp(endDate);
  return (
    `<!date^${startDateUnix}^{date_short} {time}|${startDate.toLocaleDateString()}> - ` +
    `<!date^${endDateUnix}^{date_short} {time}|${endDate.toLocaleDateString()}>`
  );
};
