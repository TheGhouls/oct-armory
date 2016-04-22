import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GhHelper } from '../../../api/github/GhHelper.es6.js';
import { getRepoReadme, getReposArmory, getRepo} from '../../../api/github/methods.js'
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import './addPlan.jade';
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.addPlan.events({
  'click .addBp': (e) => {
    console.log(e.currentTarget.attributes.id);
    //console.log(this);
    FlowRouter.go('/plan/add/'+e.currentTarget.attributes.id.value);
  }
});

/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.addPlan.helpers({
  isLoading () {
    //console.log(Session.get("getUserRepo"));
    return Session.get("loaded");
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
    Session.set('loaded', false);
    let chached_count = 0;
    if (typeof (CachedLocalColection) === 'object'){
      console.log('CachedLocalColection');
      chached_count = CachedLocalColection.find().count();
    }
    console.log("getUserArmoryRepos");

    if(Session.get('getReposArmory') || chached_count > 0) {
      
      if(CachedLocalColection.find().count() >= 1 && CachedLocalColection.find().fetch()[0].expire <= new Date().getTime()) {
        console.log("in cache expire: ", CachedLocalColection.find().fetch()[0].expire)
        console.log("reactive session with mongo cached data");
        Session.set('getReposArmory', CachedLocalColection.find().fetch()[0].getReposArmory);
      }
      
      return Session.get('getReposArmory');
    }

    getReposArmory.call({
      user_gh_id: Meteor.user().services.github.username
    }, (err, res) => {
      if (err) {
        if (err.error === 404) {
          console.log('404 getReposArmory: ', err)
          Session.set('error', err.error);
        } else {
          console.log('unexpected error: ', err)
          Session.set('error', err);
        }
      } else {
        console.log('succes', res);
        //CachedLocalColection = new Mongo.Collection(null);
        CachedLocalColection.remove({});
        CachedLocalColection.insert({getReposArmory: res, expire: new Date().getTime() + 10000}, (err, res) => {
          //console.log(res);
          console.log(CachedLocalColection.find().count());
        });
        Session.set('getReposArmory', res);
        Session.set('loaded', true);
      }
    });
    
    return Session.get('getReposArmory');
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
      let param = FlowRouter.getParam("_id");
        if (param) {        
          console.log("if param", param);

          addPlanClosure = function (param, repo) {
            addPlan.call({
                  repo_gh_id: param,
                  user_gh_id: Meteor.user().services.github.username,
                  repo: repo
                }, (err, res) => {
                  if (err) {
                    if (err.error === 500) {
                      console.log('500 addPlan: ', err.message)
                      Session.set('error', err.message);
                    } else {
                      console.log('unexpected error addPlan : ', err.message)
                      console.log(repo);
                      Session.set('error', err.message);
                    }
                  } else {
                    console.log('succes addPlan', res);
                    Session.set('loaded', true);
                  }
                });
          }

          if (!Session.get('getReposArmory')) {

            getRepo.call({
                repo_gh_id: param,
                user_gh_id: Meteor.user().services.github.username
              }, (err, res) => {
                if (err) {
                  if (err.error === 404) {
                    console.log('404 getRepo: ', err.message)
                    Session.set('error', err.message);
                  } else {
                    console.log('unexpected error: ', err.message)
                    Session.set('error', err.message);
                  }
                } else {
                  console.log('succes addPlan client', res.data);
                  Session.set('getReposArmory', res.data);
                  addPlanClosure(param, res.data);
                }
              });

          } else{
            addPlanClosure(param, Session.get('getReposArmory'));
          }

        }
      // let gh = new GhHelper();
      // let res = gh.getUserRepo(Meteor.user().services.github.username);
      //let readme = gh.getRepoReadme(Meteor.user().services.github.username,"erp_meteor");
    }
  });
});

Template.addPlan.onDestroyed(function () {
});