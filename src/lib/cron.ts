import sendNotificationsBeforeCourseStart from './cron-utils';
import cron from 'node-cron';

cron.schedule('* * * * *', () => {
  sendNotificationsBeforeCourseStart();
});
