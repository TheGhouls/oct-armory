//import {Session} from 'meteor/session';
import { Plans } from './plansCollections.es6.js';


export const addPlan = new ValidatedMethod({
  name: 'addPlan',

  validate: new SimpleSchema({
    repo_gh_id: { type: String},
    user_gh_id: { type: String},
    repo: { type: [Object], blackbox: true}

  }).validator(),

  run({repo_gh_id, user_gh_id, repo}){
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
      let x = _.where(repo, {name: repo_gh_id});
      //console.log('x is: ', x[0].readme);
      if (Meteor.isServer){
        try {
          res = Plans.insert({
            name: x[0].name, 
            armory_info: x[0].armory_info,
            gh_repo_url: x[0].html_url,
            gh_clone_url: x[0].clone_url,
            gh_repo_id: x[0].id,
            gh_readme: x[0].readme,
            gh_zip_url: x[0].archive_url.replace('{archive_format}{/ref}', 'zipball'),
            gh_tar_url: x[0].archive_url.replace('{archive_format}{/ref}', 'tarball'),
            gh_stargazers_count: x[0].stargazers_count,
            gh_watchers_count: x[0].watchers_count
            });
          //console.log('res is: ', x[0].readme);
          return res;
        } catch (e) {
          throw new Meteor.Error('plans.addPlan', "can't write the DB error is: "+e.message);
         }  
      }
  }
});