import { Plans } from '../plansCollections.es6.js';
//import 'meteor:simple:rest';

Meteor.publish('plans', function() {
  return Plans.find({
    userId: { $exists: false }
  }, {
    fields: Plans.owner,
    fields: Plans.create,
    fields: Plans.name,
    fields: Plans.short_description,
    fields: Plans.gh_readme,
    fields: Plans.gh_zip_url,
    fields: Plans.gh_stargazers_count,
    fields: Plans.gh_watchers_count,
    fields: Plans.last_modif
  },
  {limit: 25, sort: {create: 1}});
});

Meteor.publish('myPlans', function(){
  return Plans.find({
    owner: this.userId
  }, {limit: 25, sort: {create: 1}});
});

// REST end point for OCT CLI
Meteor.publish('showPlan', function(name){
  return Plans.find({
    name: name
  },
  {gh_tar_url: 1 },
  {limit: 1, sort: {create: 1}});
},{
  url: "get-plan/:0",
  httpMethod: "get"
});
