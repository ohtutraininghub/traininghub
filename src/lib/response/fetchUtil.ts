import {
  MessageResponseType,
  MessageType,
  MessageWithDataResponseType,
} from './responseUtil';

export const get = async (url: RequestInfo | URL) => {
  const response = await fetch(url, { method: 'GET' });
  const responseAsJson = await responseToJson(response);
  return responseAsJson;
};

export const post = async (url: RequestInfo | URL, data?: unknown) => {
  return await commonBody(url, data, 'POST');
};

export const update = async (url: RequestInfo | URL, data: unknown) => {
  return await commonBody(url, data, 'PUT');
};

export const remove = async (url: RequestInfo | URL, data: unknown) => {
  return await commonBody(url, data, 'DELETE');
};

/**
 * Example usage
 *
 * @example
 * const responseJson = await post('/api/some/route', inputJson);
 * const withDataJson = asResponseDataJson(responseJson)
 * if (withDataJson) {
 *   const data = withDataJson.data
 * }
 */
export const asResponseDataJson = (jsonResponse: MessageResponseType) => {
  const jsonWithData = jsonResponse as MessageWithDataResponseType;
  return jsonWithData.data ? jsonWithData : undefined;
};

const commonBody = async (
  url: RequestInfo | URL,
  data: unknown,
  method: string
) => {
  const response = await fetch(url, {
    method: method,
    body: JSON.stringify(data),
  });
  return await responseToJson(response);
};

const responseToJson = async (response: Response) => {
  const contentType = response.headers.get('Content-Type');
  if (
    !response.ok &&
    (!contentType || !contentType.includes('application/json'))
  ) {
    return {
      message: 'Internal server error',
      messageType: MessageType.ERROR,
    };
  }

  const jsonResponse = await response.json();
  if (!jsonResponse.message || !jsonResponse.messageType) {
    throw Error('Response did not use proper message format...');
  }

  return jsonResponse as MessageResponseType;
};
