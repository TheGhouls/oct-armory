import { Saas } from '../saasCollections.js';

Meteor.publish('Saas.test', function() {
  return Saas.find({
    userId: {$exists: false}
  }, {
    fields: Saas.owner,
    fields: Saas.topic,
    fields: Saas.message
  });
});
