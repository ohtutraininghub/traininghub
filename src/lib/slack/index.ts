const token = process.env.SLACK_BOT_TOKEN;

export const sendMessageToUser = async (userEmail: string, message: string) => {
  const userId = await findUserIdByEmail(userEmail);
  await sendMessage(userId, message);
};

export const sendMessage = async (channel: string, message: string) => {
  const payload = {
    channel: channel,
    text: message,
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

export const findUserIdByEmail = async (email: string) => {
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
