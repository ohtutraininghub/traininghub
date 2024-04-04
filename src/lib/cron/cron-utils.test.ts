import { mock } from 'node:test';
import sendNotificationsBeforeCourseStart from './cron-utils';
import { mockComponent } from 'react-dom/test-utils';

const inOneDay = new Date();
inOneDay.setDate(inOneDay.getDate() + 1);
const inThreeDays = new Date();
inThreeDays.setDate(inThreeDays.getDate() + 3);

const courseInOneDay = {
  students: [
    {
      email: 'email1@email.com',
    },
    { email: 'hotmail@email.gov.uk' },
  ],
  id: '123',
  name: 'testCourse1',
  description: 'testDescription',
  summary: 'testSummary',
  startDate: inOneDay,
  endDate: inOneDay,
  lastEnrollDate: null,
  lastCancelDate: null,
  maxStudents: '10',
  createdById: '123',
  image: null,
  slackChannelId: '123',
};

const courseInThreeDays = {
  students: {
    email: 'email2@email.com',
  },
  id: '123',
  name: 'testCourse2',
  description: 'testDescription',
  summary: 'testSummary',
  startDate: inThreeDays,
  endDate: inThreeDays,
  lastEnrollDate: null,
  lastCancelDate: null,
  maxStudents: '10',
  createdById: '123',
  image: null,
  slackChannelId: '123',
};

const mockSendReminderToUsers = jest.fn();
jest.mock('../slack/index', () => ({
  sendReminderToUsers: mockSendReminderToUsers,
}));

const mockCoursesWithStartDateBetweenDates = jest.fn();
mockCoursesWithStartDateBetweenDates.mockReturnValueOnce(courseInOneDay);
mockCoursesWithStartDateBetweenDates.mockReturnValueOnce(courseInThreeDays);
jest.mock('../prisma/courses', () => ({
  coursesWithStartDateBetweenDates: mockCoursesWithStartDateBetweenDates,
}));

describe('Tests for cron-utils', () => {
  it('should call sendReminderToUsers with the correct parameters', () => {
    sendNotificationsBeforeCourseStart();
    expect(mockSendReminderToUsers).toHaveBeenNthCalledWith(
      1,
      {
        students: [
          {
            email: 'email1@email.com',
          },
          { email: 'hotmail@email.gov.uk' },
        ],
        id: '123',
        name: 'testCourse1',
        description: 'testDescription',
        summary: 'testSummary',
        startDate: inOneDay,
        endDate: inOneDay,
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: '10',
        createdById: '123',
        image: null,
        slackChannelId: '123',
      },
      'email1@email.com',
      '1 day'
    );

    expect(mockSendReminderToUsers).toHaveBeenNthCalledWith(
      2,
      {
        students: [
          {
            email: 'email1@email.com',
          },
          { email: 'hotmail@email.gov.uk' },
        ],
        id: '123',
        name: 'testCourse1',
        description: 'testDescription',
        summary: 'testSummary',
        startDate: inOneDay,
        endDate: inOneDay,
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: '10',
        createdById: '123',
        image: null,
        slackChannelId: '123',
      },
      'hotmail@email.gov.uk',
      '1 day'
    );

    expect(mockSendReminderToUsers).toHaveBeenNthCalledWith(
      3,
      {
        students: {
          email: 'email2@email.com',
        },
        id: '123',
        name: 'testCourse2',
        description: 'testDescription',
        summary: 'testSummary',
        startDate: inThreeDays,
        endDate: inThreeDays,
        lastEnrollDate: null,
        lastCancelDate: null,
        maxStudents: '10',
        createdById: '123',
        image: null,
        slackChannelId: '123',
      },
      'email2@email.com',
      '3 days'
    );
  });
});
