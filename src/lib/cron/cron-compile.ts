import sendNotificationsBeforeCourseStart from './cron-utils';
import * as cron from 'node-cron';

cron.schedule('* * * * *', () => {
  sendNotificationsBeforeCourseStart();
});