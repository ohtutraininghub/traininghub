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
        text: 'A course you were enrolled in has been cancelled :exclamation:',
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

export const createBlocksUpdatedTraining = (
  oldCourse: Course,
  updatedCourse: Course
) => {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Training details updated!',
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*<${process.env.HOST_URL}/en?courseId=${updatedCourse.id}|${updatedCourse.name}>* has recent updates:`,
        },
      ],
    },
  ];

  if (!(updatedCourse.name === oldCourse.name)) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':pencil2:',
        },
        {
          type: 'mrkdwn',
          text: ` ~${oldCourse.name}~ :arrow_right: ${updatedCourse.name}`,
        },
      ],
    });
  }

  if (
    !(
      updatedCourse.startDate.toString() === oldCourse.startDate.toString() &&
      updatedCourse.endDate.toString() === oldCourse.endDate.toString()
    )
  ) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':calendar:',
        },
        {
          type: 'mrkdwn',
          text: ` ~${formatDateRangeForSlack(
            oldCourse.startDate,
            oldCourse.endDate
          )}~ :arrow_right: ${formatDateRangeForSlack(
            updatedCourse.startDate,
            updatedCourse.endDate
          )}`,
        },
      ],
    });
  }

  if (
    !(
      updatedCourse.lastEnrollDate?.toString() ===
      oldCourse.lastEnrollDate?.toString()
    )
  ) {
    if (oldCourse.lastEnrollDate && updatedCourse.lastEnrollDate) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ':bangbang:',
          },
          {
            type: 'mrkdwn',
            text: `~*Enrollment deadline:* ${formatDateForSlack(
              oldCourse.lastEnrollDate
            )}~ :arrow_right: *Enrollment deadline:* ${formatDateForSlack(
              updatedCourse.lastEnrollDate
            )}`,
          },
        ],
      });
    }
    if (updatedCourse.lastEnrollDate && !oldCourse.lastEnrollDate) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ':bangbang:',
          },
          {
            type: 'mrkdwn',
            text: `*Enrollment deadline:* ${formatDateForSlack(
              updatedCourse.lastEnrollDate
            )}`,
          },
        ],
      });
    }
  }

  if (
    !(
      updatedCourse.lastCancelDate?.toString() ===
      oldCourse.lastCancelDate?.toString()
    )
  ) {
    if (oldCourse.lastCancelDate && updatedCourse.lastCancelDate) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ':bangbang:',
          },
          {
            type: 'mrkdwn',
            text: `~*Cancellation deadline:* ${formatDateForSlack(
              oldCourse.lastCancelDate
            )}~ :arrow_right: *Cancellation deadline:* ${formatDateForSlack(
              updatedCourse.lastCancelDate
            )}`,
          },
        ],
      });
    }
    if (updatedCourse.lastCancelDate && !oldCourse.lastCancelDate) {
      blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: ':bangbang:',
          },
          {
            type: 'mrkdwn',
            text: `*Cancellation deadline:* ${formatDateForSlack(
              updatedCourse.lastCancelDate
            )}`,
          },
        ],
      });
    }
  }

  if (!(updatedCourse.maxStudents === oldCourse.maxStudents)) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: ':busts_in_silhouette:',
        },
        {
          type: 'mrkdwn',
          text: `~${oldCourse.maxStudents} spots~ :arrow_right: ${updatedCourse.maxStudents} spots`,
        },
      ],
    });
  }

  return blocks;
};

export const createBlocksCourseFeedback = (course: Course) => {
  const formId = course.googleFormsId;
  console.log('formId', formId);
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Your feedback is valued!',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${course.name}* organizer would like to hear your thoughts on the course`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Leave your feedback through the link below :point_down:',
      },
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
          text: `<https://docs.google.com/forms/d/e/${formId}/viewform?usp=sf_link|Leave feedback>`,
        },
      ],
    },
  ];
  return blocks;
};

const formatDateForSlack = (date: Date) => {
  const dateUnix = dateToUnixTimestamp(date);
  return `<!date^${dateUnix}^{date_short} {time}|${date.toLocaleDateString()}>`;
};

const formatDateRangeForSlack = (startDate: Date, endDate: Date) =>
  `${formatDateForSlack(startDate)} - ${formatDateForSlack(endDate)}`;
