import { Saas } from '../saasCollections.js';


Meteor.publish('saas', function() {
  return Saas.find({
    userId: {$exists: false}
  }, {
    fields: Saas.owner,
    fields: Saas.topic,
    fields: Saas.message,
    sort: {create:-1},
    limit:1
  });
});
