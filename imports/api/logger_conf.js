import {Logger} from 'meteor/ostrio:logger';
import {LoggerFile} from 'meteor/ostrio:loggerfile';

export const log = new Logger();

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

let clientDSN = 'http://da50322d59604cf1847b41a18c8ee73a:39eaeb40b1614ab2ac1756bb5e75ee68@sentry.theghouls.io/2';

let serverDSN = 'http://da50322d59604cf1847b41a18c8ee73a@sentry.theghouls.io/2';

Meteor.methods({
  getserverdsn: function() {
    return serverDSN;
  }
});

Meteor.methods({
  getclientdsn: function() {
    return clientDSN;
  }
});

function initialize_client() {
  Meteor.call('getclientdsn', function(error, client_dsn) {
    if (error) throw error;
    RavenLogger.initialize({
      client: client_dsn,
	});
 };
}

function initialize_server() {
  Meteor.call('getserverdsn', function(error, server_dsn) {
    if (error) throw error;
    RavenLogger.initialize({
      client: server_dsn,
		}, {
  			patchGlobal: function() {
    		console.log('toto');
    		process.exit(1);
  			}
	});
 };
}

if (Meteor.isClient) {
  Meteor.startup(function() {
    initialize_client();
  });
}

initialize_server();