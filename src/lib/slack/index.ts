import { Course } from '@prisma/client';
import {
  SLACK_API_INVITE_USERS,
  SLACK_API_LOOKUP_BY_CHANNEL,
  SLACK_API_LOOKUP_BY_EMAIL,
  SLACK_API_POST_MESSAGE,
  SLACK_API_CREATE_CHANNEL,
  SLACK_NEW_TRAININGS_CHANNEL,
  SLACK_API_ARCHIVE_CHANNEL,
  SLACK_CHANNEL_PREFIX,
  SLACK_API_RENAME_CHANNEL,
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

const createUsersIdListByEmail = async (users: string[]) => {
  const idList = await Promise.all(
    users.map((user) => findUserIdByEmail(user))
  );
  return idList.filter((id) => id !== null);
};

export const sendCoursePoster = async (course: Course) => {
  const channel = SLACK_NEW_TRAININGS_CHANNEL;
  if (!isProduction()) return;
  const channelExistsResult = await channelExists(channel, 'name');
  if (!channelExistsResult) return;
  const message = createBlocksNewTraining(course);
  await sendMessage(channel, message);
};

export const createChannelForCourse = async (course: Course) => {
  if (!isProduction()) return { ok: false, error: 'not_production' };
  const channelName = renderChannelName(course);

  return await createNewChannel(channelName);
};

const renderChannelName = (course: Course) => {
  let channelName =
    SLACK_CHANNEL_PREFIX +
    course.name.toLowerCase().replace('[^a-z0-9s-]', '').replace(/\s/g, '-');
  if (channelName.length > 80) {
    channelName = channelName.substring(0, 80);
  }
  return channelName;
};

const createNewChannel = async (channel_name: string) => {
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
    users: await createUsersIdListByEmail(students),
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

type ArgumentType = 'id' | 'name';

const channelExists = async (channel: string, argumentType: ArgumentType) => {
  const res = await fetch(`${SLACK_API_LOOKUP_BY_CHANNEL}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  if (!data.channels) return false;
  if (argumentType === 'id') {
    return data.channels.some((c: { id: string }) => c.id === channel);
  }
  if (argumentType === 'name') {
    return data.channels.some((c: { name: string }) => c.name === channel);
  }
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

const renameChannel = async (channelId: string, channelName: string) => {
  if (channelName.length > 71) {
    channelName = channelName.substring(0, 71);
  }
  // Adds date to the end of the channel name
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  const newName = `${channelName}-${day}${month}${year}`;
  const payload = {
    channel: channelId,
    name: newName,
  };

  const res = await fetch(SLACK_API_RENAME_CHANNEL, {
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

export const archiveChannel = async (course: Course) => {
  if (!course.slackChannelId) return;
  const payload = {
    channel: course.slackChannelId,
  };
  if (!isProduction()) return;
  const channelExistsResult = await channelExists(course.slackChannelId, 'id');
  if (!channelExistsResult) return;

  const channelName = renderChannelName(course);

  // Every Slack channel must have a unique name.
  // To avoid future naming conflicts, channel must be renamed before archiving.
  const renameChannelResponse = await renameChannel(
    course.slackChannelId,
    channelName
  );
  if (renameChannelResponse.ok) {
    await fetch(SLACK_API_ARCHIVE_CHANNEL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  }
};

const sendMessageToUser = async (userEmail: string, blocks: Block[]) => {
  const userId = await findUserIdByEmail(userEmail);
  if (!userId) return;
  await sendMessage(userId, blocks);
};
