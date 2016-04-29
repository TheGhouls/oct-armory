import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GhHelper } from '../../../api/github/GhHelper.es6.js';
import { getRepoReadme, getReposArmory, getRepo} from '../../../api/github/methods.js'
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import './addPlan.jade';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { log } from '../../../api/logger_conf.js';
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
          log.error('404 error: ', err.message, this.userId);
          console.log('404 error: ', err)
          sAlert.error('getReadme 404 error: '+err.message);
        } else {
          log.error('getReadme unexpected error: ', err.message, this.userId);
          console.log('unexpected error: ', err)
          sAlert.error('getReadme unexpected error: '+err.message);
        }
      } else {
        console.log('success', res);
        sAlert.success('getReadme Success: '+res.lenght);
      }
    });
  },

  getUserArmoryRepos () {
    Session.set('loaded', false);

    console.log("getUserArmoryRepos chached_count: ", Session.get('getReposArmory') || 'undef');

    if(Session.get('getReposArmory') || CachedLocalColection.find().count() > 0) {
      
      if(CachedLocalColection.find().count() >= 1 && CachedLocalColection.find().fetch()[0].expire > new Date().getTime()) {
        console.log("in cache expire valide: ", CachedLocalColection.find().fetch()[0].expire, new Date().getTime());
        if(Session.get('getReposArmory') !== 'undefined'){
          console.log("reactive session with mongo cached data");
          Session.set('loaded', true);
          Session.set('getReposArmory', CachedLocalColection.find().fetch()[0].getReposArmory);
        }
        
      }
      Session.set('loaded', true);
      return Session.get('getReposArmory');
    } else {
      
      getReposArmory.call({
        user_gh_id: Meteor.user().services.github.username
      }, (err, res) => {
        if (err) {
          if (err.error === 404) {
            log.error('404 getReposArmory: ', err.message, this.userId);
            console.log('404 getReposArmory: ', err);
            Session.set('loaded', true);
            sAlert.error('404 getReposArmoryerror: '+err.message);
          } else if (err.error === 'gh.getReposArmory.norepofound') {
            Session.set('loaded', true);
            sAlert.warning('no new battle plans founds');
          } else {
            log.error('unexpected getReposArmoryerror: ', err.message, this.userId);
            console.log('unexpected error: ', err)
            sAlert.error('unexpected getReposArmoryerror: '+err.message);
          }
        } else {
          console.log('succes getReposArmory ', res);
          Session.set('loaded', true);
          CachedLocalColection.remove({});
          CachedLocalColection.insert({getReposArmory: res, expire: new Date().getTime() + 10000}, (err, res) => {
            console.log('chached collection', CachedLocalColection.find().fetch());
          });
          Session.set('getReposArmory', res);
        }
      });
    }
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
                    if (err.error === 404) {
                      log.error('404 addPlan: error', err.message, this.userId);
                      console.log('404 addPlan: ', err.message)
                      sAlert.error('404 addPlan: error: '+err.message);
                    } else {
                      log.error('unexpected error addPlan: ', err.message, this.userId);
                      console.log('unexpected error addPlan: ', err.message)
                      console.log(repo);
                      sAlert.error('unexpected addPlan: error: '+err.message);
                    }
                  } else {
                    console.log('succes addPlan', res);
                    
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
                    log.error('404 getRepo: error: ', err.message, this.userId);
                    console.log('404 getRepo: ', err.message)
                    sAlert.error('404 getRepo: error: '+err.message);
                  } else {
                    log.error('unexpected getRepo: error: ', err.message, this.userId);
                    console.log('unexpected getRepo: error: ', err.message)
                    sAlert.error('unexpected getRepo: error: '+err.message);
                  }
                } else {
                  console.log('succes getRepo client', res.data);
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