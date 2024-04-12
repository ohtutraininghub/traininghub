import { handleSendNotifications } from './route';
import { NextRequest } from 'next/server';
import { createMocks } from 'node-mocks-http';

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

describe('handleSendNotifications', () => {
  it('should return success response if Bearer token is correct', async () => {
    const request = mockGetRequest();
    const response = await handleSendNotifications(request);
    expect(response.status).toBe(200);
  });

  it('should return unauthorized response if wrong token is used', async () => {
    const request = mockGetRequestWithWrongToken();
    const response = await handleSendNotifications(request);
    expect(response.status).toBe(401);
  });
});
