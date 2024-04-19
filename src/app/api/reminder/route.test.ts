import { POST } from './route';
import { MessageType } from '@/lib/response/responseUtil';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';
import sendNotificationsBeforeCourseStart from '@/lib/cron/cron-utils';

const mockGetRequest = () => {
  const { req } = createMocks<NextRequest>({
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + process.env.AUTH_TOKEN,
    },
  });

  req.headers.get = jest
    .fn()
    .mockReturnValue('Bearer ' + process.env.AUTH_TOKEN);
  return req;
};

const mockGetRequestWithWrongToken = () => {
  const { req } = createMocks<NextRequest>({
    method: 'POST',
    headers: {
      authorization: 'Bearer ' + 'wrong-token',
    },
  });

  req.headers.get = jest.fn().mockReturnValue('Bearer ' + 'wrong-token');
  return req;
};
jest.mock('../../../lib/cron/cron-utils', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('handleSendNotifications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return success response if Bearer token is correct', async () => {
    const request = mockGetRequest();
    const response = await POST(request);
    const data = await response.json();

    expect(data.message).toBe('Reminders sent succesfully');
    expect(data.messageType).toBe(MessageType.SUCCESS);
    expect(response.status).toBe(200);
  });
  it('should call notification sender if Bearer token is correct', async () => {
    const request = mockGetRequest();
    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(sendNotificationsBeforeCourseStart).toHaveBeenCalledTimes(1);
  });
  it('should return unauthorized response if wrong token is used', async () => {
    const request = mockGetRequestWithWrongToken();
    const response = await POST(request);
    const data = await response.json();

    expect(data.message).toBe('Forbidden');
    expect(data.messageType).toBe(MessageType.ERROR);
    expect(response.status).toBe(401);
  });
  it('should not call notification sender if Bearer token is incorrect', async () => {
    const request = mockGetRequestWithWrongToken();
    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(sendNotificationsBeforeCourseStart).not.toHaveBeenCalled();
  });
});
