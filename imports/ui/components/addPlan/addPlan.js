import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GhHelper } from '../../../api/github/GhHelper.es6.js';
import { getRepoReadme, getReposArmory, getRepo} from '../../../api/github/methods.js'
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
import './addPlan.jade';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { log } from '../../../api/logger_conf.js';


/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.addPlan.events({
  'click .addBp': (e) => {
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
          sAlert.error(TAPi18n.__("add_plan.errors.readme_not_found"));
        } else {
          log.error(TAPi18n.__("add_plan.errors.unexpected_readme_error {ERROR}", ERROR = err.message));
          sAlert.error(TAPi18n.__("add_plan.errors.unexpected_readme_error {ERROR}", ERROR = err.message));
        }
      } else {
        sAlert.success(TAPi18n.__("add_plan.success.success_add"));
      }
    });
  },

  getUserArmoryRepos () {
    Session.set('loaded', false);
    console.log("getUserArmoryRepos chached_count: ", Session.get('getReposArmory') || 'undef');
    if(Session.get('getReposArmory') || CachedLocalColection.find().count() > 0) {
      if(CachedLocalColection.find().count() >= 1 && CachedLocalColection.find().fetch()[0].expire > new Date().getTime()) {
        if(Session.get('getReposArmory') !== 'undefined'){
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
            Session.set('loaded', true);
            sAlert.error(TAPi18n.__("add_plan.errors.no_repo_found"));
          } else if (err.error === 'gh.getReposArmory.norepofound') {
            Session.set('loaded', true);
            sAlert.warning(TAPi18n.__("add_plan.warning.no_new_repo_found"));
          } else {
            log.error('unexpected getReposArmoryerror: ', err.message, this.userId);
            sAlert.error(TAPi18n.__("add_plan.errors.unexpected_found_repo_error {ERROR}", ERROR=err.message));
          }
        } else {
          console.log('succes getReposArmory ', res);
          Session.set('loaded', true);
          CachedLocalColection.remove({});
          CachedLocalColection.insert({getReposArmory: res, expire: new Date().getTime() + 10000}, (err, res) => {
            console.log('cached collection', CachedLocalColection.find().fetch());
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
  const Plans = this.subscribe('plans');
  this.subscribe('userData');
  this.subscribe('getUserData');
  Tracker.autorun(() => {
    const isReady = Plans.ready();
    console.log(`Plans is ${isReady ? 'ready' : 'not ready'}`);
  });


});

Template.addPlan.onRendered(function () {
  this.autorun(() => {
    if (Meteor.user()) {
      let param = FlowRouter.getParam("_id");
        if (param) {
          addPlanClosure = function (param, repo) {
            addPlan.call({
                  repo_gh_id: param,
                  user_gh_id: Meteor.user().services.github.username,
                  repo: repo
                }, (err, res) => {
                  if (err) {
                    if (err.error === 404) {
                      sAlert.error(TAPi18n.__("add_plan.errors.plan_not_found"));
                    } else {
                      log.error('unexpected error addPlan: ', err.message, this.userId);
                      sAlert.error(TAPi18n.__("add_plan.errors.unexpected_error_finding_plan {ERROR}", ERROR=err.message));
                    }
                  } else {
                    sAlert.success(TAPi18n.__("add_plan.success.success_add: {res}", RES=res));
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
                    sAlert.error(TAPi18n.__("add_plan.errors.no_repo_found"));
                  } else {
                    log.error('unexpected getRepo: error: ', err.message, this.userId);
                    sAlert.error(TAPi18n.__("add_plan.errors.unexpected_found_repo_error {ERROR}", ERROR=err.message));
                  }
                } else {
                  Session.set('getReposArmory', res.data);
                  addPlanClosure(param, res.data);
                }
              });
          } else{
            addPlanClosure(param, Session.get('getReposArmory'));
          }

        }
    }
  });
});

Template.addPlan.onDestroyed(function () {
});
