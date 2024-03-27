'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var cron_utils = require('./cron-utils');
var cron = require('node-cron');
cron.schedule('* * * * *', function () {
  cron_utils.default();
});
