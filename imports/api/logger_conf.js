import {Logger} from 'meteor/ostrio:logger';
import {LoggerFile} from 'meteor/ostrio:loggerfile';
import {RavenLogger} from 'meteor/deepwell:raven';

export const log = new Logger();
export const logRaven = RavenLogger;

let LogFile = new LoggerFile(log, {
  fileNameFormat: function(time) {
    /* Create log-files hourly */
    return (time.getDate()) + "-" + (time.getMonth() + 1) + "-" + (time.getFullYear()) + "_" + (time.getHours()) + ".log";
  },
  format: function(time, level, message, data, userId) {
    /* Omit Date and hours from messages */
    return "[" + level + "] | " + (time.getMinutes()) + ":" + (time.getSeconds()) + " | \"" + message + "\" | User: " + userId + "\r\n";
  },
  path: Meteor.absolutePath /* Use absolute storage path */
});

LogFile.enable();

/*
	This is a practice for use raven logs with oct armory.

	example :
			try {
			   throw "Test raven";
			}
			catch (error) {
				// call raven exception here
				Raven.captureException(error);
			}
	This is a simple way for catch errors.
*/

RavenLogger.initialize({
      client: Meteor.settings.public.clientDSN,
      server: Meteor.settings.public.serverDSN
  }, {
      trackUser: true
    });

