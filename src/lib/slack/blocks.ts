import { Course } from '@prisma/client';
import { dateToUnixTimestamp } from '../timedateutils';

export const createBlocksCourseFull = (course: Course) => {
  return [
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
        text: `*<${process.env.HOST_URL}/en?courseId=${course.id}|${course.name}>* has reached full capacity *(${course.maxStudents}/${course.maxStudents})*`,
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

export const createBlocksTrainingCancelled = (course: Course) => {
  return [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'This course has been cancelled :exclamation:',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${course.name}* has been cancelled`,
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
          text: `~${formatDateRangeForSlack(
            course.startDate,
            course.endDate
          )}~`,
        },
      ],
    },
  ];
};

export const createBlocksNewTraining = (course: Course) => {
  const blocks = [
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
        text:
          course.summary ||
          'Learn more about this training from the link below :point_down:',
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
          text: formatDateRangeForSlack(course.startDate, course.endDate),
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
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':bangbang:',
        },
        {
          type: 'mrkdwn',
          text: `*Do it before:* ${formatDateForSlack(course.lastEnrollDate)}`,
        },
      ],
    });
  }

  return blocks;
};

const formatDateForSlack = (date: Date) => {
  const dateUnix = dateToUnixTimestamp(date);
  return `<!date^${dateUnix}^{date_short} {time}|${date.toLocaleDateString()}>`;
};

const formatDateRangeForSlack = (startDate: Date, endDate: Date) =>
  `${formatDateForSlack(startDate)} - ${formatDateForSlack(endDate)}`;
