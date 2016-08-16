import { Meteor } from 'meteor/meteor';
import redis from 'redis';


export let client = redis.createClient();

client.setSync = Meteor.wrapAsync(client.set);
client.getSync = Meteor.wrapAsync(client.get);

client.on("error", function(err) {
  console.log("REDIS ERROR", err);
});

client.on("connect", function() {
  console.log("connected");
});
