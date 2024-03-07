import { Course } from '@prisma/client';
import {
  SLACK_API_INVITE_USERS,
  SLACK_API_LOOKUP_BY_CHANNEL,
  SLACK_API_LOOKUP_BY_EMAIL,
  SLACK_API_POST_MESSAGE,
  SLACK_API_CREATE_CHANNEL,
  SLACK_NEW_TRAININGS_CHANNEL,
  SLACK_CHANNEL_PREFIX,
} from './constants';
import {
  createBlocksCourseFull,
  createBlocksNewTraining,
  createBlocksTrainingCancelled,
} from './blocks';
import { isProduction } from '../env-utils';

interface Block {
  type: string;
  text?: {
    type: string;
    text?: string;
    emoji?: boolean;
  };
}

const token = process.env.SLACK_BOT_TOKEN;

export const sendCourseFullMessage = async (
  userEmail: string,
  course: Course
) => {
  if (!isProduction()) return;
  const blocks = createBlocksCourseFull(course);
  sendMessageToUser(userEmail, blocks);
};

export const sendTrainingCancelledMessage = async (
  userEmail: string,
  course: Course
) => {
  if (!isProduction()) return;
  const blocks = createBlocksTrainingCancelled(course);
  await sendMessageToUser(userEmail, blocks);
};

// rate limit 50 requests per minute
const findUserIdByEmail = async (email: string) => {
  const res = await fetch(`${SLACK_API_LOOKUP_BY_EMAIL}${email}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  return data.user?.id;
};

const createUsersIdListByEmail = (users: string[]) => {
  return users.map((user) => findUserIdByEmail(user));
};

export const sendCoursePoster = async (course: Course) => {
  const channel = SLACK_NEW_TRAININGS_CHANNEL;
  if (!isProduction()) return;
  const channelExistsResult = await channelExists(channel);
  if (!channelExistsResult) return;
  const message = createBlocksNewTraining(course);
  await sendMessage(channel, message);
};

export const createChannelForCourse = async (course: Course) => {
  const channelName =
    SLACK_CHANNEL_PREFIX +
    course.name.toLowerCase().replace('[^a-z0-9s-]', '').replace(/\s/g, '-');

  return await createNewChannel(channelName);
};

export const createNewChannel = async (channel_name: string) => {
  const res = await fetch(SLACK_API_CREATE_CHANNEL, {
    method: 'POST',
    body: JSON.stringify({ name: channel_name }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

export const addUsersToChannel = async (
  channel: string,
  students: string[]
) => {
  if (!isProduction()) return;

  const payload = {
    channel: channel,
    users: createUsersIdListByEmail(students),
  };

  const res = await fetch(SLACK_API_INVITE_USERS, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  return data;
};

const channelExists = async (channel: string) => {
  const res = await fetch(`${SLACK_API_LOOKUP_BY_CHANNEL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  if (!data.channels) return false;
  return data.channels.some((c: { name: string }) => c.name === channel);
};

const sendMessage = async (channel: string, blocks: Block[]) => {
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

const sendMessageToUser = async (userEmail: string, blocks: Block[]) => {
  const userId = await findUserIdByEmail(userEmail);
  if (!userId) return;
  await sendMessage(userId, blocks);
};
