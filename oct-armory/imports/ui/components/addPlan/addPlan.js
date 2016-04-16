import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {GhHelper} from '../../../api/github/GhHelper.es6.js';
import {getRepoReadme, getReposArmory, getUserRepo} from '../../../api/github/methods.js'
import {Session} from 'meteor/session';
import './addPlan.jade';
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.addPlan.events({
  'click .addBp': (id = this) => {
    //console.log(id.currentTarget.attributes.id.value);
    Session.set('error', id.currentTarget.attributes.id.value);
  }
});

/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.addPlan.helpers({
  ghRepos () {
    //console.log(Session.get("getUserRepo"));
    return Session.get("getUserRepo");
  },

  getReadme () {
    console.log("getReadme");
    getRepoReadme.call({
      repo_id: '12345',
      user_gh_id: 'This is a todo item.'
    }, (err, res) => {
      if (err) {
        if (err.error === 404) {
          // should have some nice UI to display this
          // error, and probably use an i18n library to generate the
          // message from the error code.
          console.log('404 error: ', err)
          Session.set('error', err);
        } else {
          console.log('unexpected error: ', err)
          Session.set('error', err);
        }
      } else {
        console.log('succes', res);
        Session.set('getRepoReadme', res);
      }
    });
  },

  getUserArmoryRepos () {
    console.log("getUserArmoryRepos");
    
    getUserRepo.call({
        user_gh_id: 'karec'
      }, (err, res) => {
        if (err) {
          if (err.error === 404) {
            console.log('404 getUserRepo: ', err)
            Session.set('error', err.error);
          } else {
            console.log('unexpected error getUserRepo: ', err)
            Session.set('error', err);
          }
        } else {
          console.log('succes getUserRepo', res);
          Session.set('getUserRepo', res);
        }

    });

    // getReposArmory.call({
    //   repo_id: 'armory-sample-project',
    //   user_gh_id: 'karec'
    // }, (err, res) => {
    //   if (err) {
    //     if (err.error === 404) {
    //       console.log('404 getReposArmory: ', err)
    //       Session.set('error', err.error);
    //     } else {
    //       console.log('unexpected error: ', err)
    //       Session.set('error', err);
    //     }
    //   } else {
    //     console.log('succes', res);
    //     Session.set('getReposArmory', res);
    //   }
    // });
  },

});

/*****************************************************************************/
/* Plan: Lifecycle Hooks */
/*****************************************************************************/
Template.addPlan.onCreated(function armoryAddPlanOnCreated() {
  console.log("onCreated plan");
});

Template.addPlan.onRendered(function () {
  console.log("onRendered plan");
  this.autorun(() => {
    if (Meteor.user()) {
      let gh = new GhHelper();
      let res = gh.getUserRepo(Meteor.user().services.github.username);
      //let readme = gh.getRepoReadme(Meteor.user().services.github.username,"erp_meteor");
    }
  });
});

Template.plan.onDestroyed(function () {
});