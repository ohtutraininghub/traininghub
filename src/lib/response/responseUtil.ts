// Eslint doesn't like TypeScript enums
/* eslint-disable no-unused-vars */

import { NextResponse } from 'next/server';

export type MessageResponseType = {
  message: string;
  messageType: MessageType;
  statusCode?: StatusCodeType;
};

export type MessageWithoutTypeResponseType = Omit<
  MessageResponseType,
  'messageType'
>;

export type MessageWithDataResponseType = MessageResponseType & {
  data: any;
};

export enum MessageType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/
export enum StatusCodeType {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNPROCESSABLE_CONTENT = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export const successResponse = ({
  message,
  statusCode,
}: MessageWithoutTypeResponseType) => {
  return messageResponse({
    message: message,
    messageType: MessageType.SUCCESS,
    statusCode: statusCode,
  });
};

export const errorResponse = ({
  message,
  statusCode,
}: MessageWithoutTypeResponseType) => {
  return messageResponse({
    message: message,
    messageType: MessageType.ERROR,
    statusCode: statusCode,
  });
};

export const messageResponse = ({
  message,
  messageType,
  statusCode,
}: MessageResponseType) => {
  return NextResponse.json(
    { message: message, messageType: messageType },
    { status: statusCode ?? StatusCodeType.INTERNAL_SERVER_ERROR }
  );
};

export const messageWithDataResponse = ({
  message,
  messageType,
  statusCode,
  data,
}: MessageWithDataResponseType) => {
  return NextResponse.json(
    { message: message, messageType: messageType, data: data },
    { status: statusCode ?? StatusCodeType.INTERNAL_SERVER_ERROR }
  );
};
