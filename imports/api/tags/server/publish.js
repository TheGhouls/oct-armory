import { Plans } from '../../plans/plansCollections.es6.js';


Meteor.publish('plansTags', function(args) {
  return Plans.find({
    "armory_info.tags": String(args)
  },
  {sort: {create:-1},limit:10}
  );
});
