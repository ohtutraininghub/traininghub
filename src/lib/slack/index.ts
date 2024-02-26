import { Course } from '@prisma/client';
import {
  SLACK_API_LOOKUP_BY_EMAIL,
  SLACK_API_POST_MESSAGE,
  SLACK_NEW_TRAININGS_CHANNEL,
} from './constants';
import { createBlocksCourseFull, createBlocksNewTraining } from './blocks';

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
  const blocks = createBlocksCourseFull(course);
  sendMessageToUser(userEmail, blocks);
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
  return data.user?.id;
};

export const sendCoursePoster = async (course: Course) => {
  const message = createBlocksNewTraining(course);
  const channel = SLACK_NEW_TRAININGS_CHANNEL;
  await sendMessage(channel, message);
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
  if (!userEmail) return;
  await sendMessage(userId, blocks);
};
