import { Course } from '@prisma/client';
import { dateToUnixTimestamp } from '@/lib/timedateutils';
import {
  SLACK_API_LOOKUP_BY_EMAIL,
  SLACK_API_POST_MESSAGE,
  SLACK_NEW_TRAININGS_CHANNEL,
} from '@/lib/slack/constants';

interface Block {
  type: string;
  text?: {
    type: string;
    text?: string;
    emoji?: boolean;
  };
}

const token = process.env.SLACK_BOT_TOKEN;

export const sendMessageToUser = async (
  userEmail: string,
  message: Block[]
) => {
  const userId = await findUserIdByEmail(userEmail);
  await sendMessage(userId, message);
};

export const sendMessage = async (channel: string, message: Block[]) => {
  // Channel can be a user id or a channel id/name
  const payload = {
    channel: channel,
    blocks: message,
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

const findUserIdByEmail = async (email: string) => {
  const res = await fetch(`${SLACK_API_LOOKUP_BY_EMAIL}${email}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
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
  const channel = SLACK_NEW_TRAININGS_CHANNEL;
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
