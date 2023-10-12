import { createMocks } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { prisma } from '@/lib/prisma/prisma';
import { MessageType, StatusCodeType } from '@/lib/response/responseUtil';

const existingTag = { name: 'Git' };
const newTag = { name: 'Jenkins' };
const duplicateTag = { name: 'git' };
const tooLongTag = {
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
const emptyTag = { name: '' };

beforeEach(async () => {
  await prisma.tag.deleteMany({});
  await prisma.tag.create({
    data: existingTag,
  });
});

describe('API', () => {
  describe('POST', () => {
    it('adds a new tag to the database', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => newTag,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe(`Tag \"${newTag.name}\" succesfully created!`);
      expect(data.messageType).toBe(MessageType.SUCCESS);
      expect(response.status).toBe(StatusCodeType.CREATED);
    });
  });
  describe('POST', () => {
    it('fails if identical tag already exists in database', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => existingTag,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create tag. Tag \"${existingTag.name}\" already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
  describe('POST', () => {
    it('fails if same tag with different casing exists in database', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => duplicateTag,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe(
        `Failed to create tag. Tag \"${duplicateTag.name}\" already exists.`
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.UNPROCESSABLE_CONTENT);
    });
  });
  describe('POST', () => {
    it('fails if the tag name is empty', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => emptyTag,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe('A tag name is required.');
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.BAD_REQUEST);
    });
  });
  describe('POST', () => {
    it('fails if the tag name is too long', async () => {
      const { req } = createMocks<NextRequest>({
        method: 'POST',
        json: () => tooLongTag,
      });

      const response = await POST(req);
      const data = await response.json();

      expect(data.message).toBe(
        'The maximum length for a tag is 50 characters.'
      );
      expect(data.messageType).toBe(MessageType.ERROR);
      expect(response.status).toBe(StatusCodeType.BAD_REQUEST);
    });
  });
});
