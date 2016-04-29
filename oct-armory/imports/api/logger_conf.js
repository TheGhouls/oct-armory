import {Logger} from 'meteor/ostrio:logger';
import {LoggerFile} from 'meteor/ostrio:loggerfile';

export const log = new Logger();

var LogFile = new LoggerFile(log, {
  fileNameFormat: function(time) {
    /* Create log-files hourly */
    return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear()) + "_" + (time.getHours()) + ".log";
  },
  format: function(time, level, message, data, userId) {
    /* Omit Date and hours from messages */
    return "[" + level + "] | " + (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
  },
  path: '/var/log/' /* Use absolute storage path */
});

LogFile.enable();

