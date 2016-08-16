import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { getRepoReadme, getReposArmory, getRepo, isStarred, getNumbersOfStars } from '../../../api/github/methods.js';
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { log } from '../../../api/logger_conf.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Showdown } from 'meteor/markdown';
import './plan.jade';
import './plan.less';

const planSub = Meteor.subscribe('plans');
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.plan.events({
  'click .addBp': (id = this) => {
    Session.set('error', id.currentTarget.attributes.id.value);
  },

  'click .star_bp': (e, template) => {
    e.preventDefault();

  }
});
/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.plan.helpers({
	getPlan () {
    let plan = null;
      console.log(planSub.ready());
      if(planSub.ready()){
        if (!Session.get('plan')) {
              let converter = new Showdown.converter();
              plan = Plans.findOne({ name: FlowRouter.getParam('_name') });
              // Convert markdown to html
              plan.gh_readme = converter.makeHtml(String(plan.gh_readme));
              //checking if this bp need update
              if(planSub.ready()){
                console.log("checking if this bp need update", plan._id);
                Meteor.call('checkForUpdate', {battle_plan_id: plan._id}, function (error, result) {
                  if(error)
                    console.log("update error", error);

                  if(result)
                    console.succes("update result", result);
                });
              }

              Session.set('plan', plan);
            } else {
              plan = Session.get('plan');
            }
      }

    return plan;
	},

  getReadMe () {
    console.log("In getreadme");
    const plan = Session.get('plan');
    if (!plan) {
      console.log("plan not set");
      return null;
    }
    console.log(getRepoReadme.call({
      repo_id: plan.gh_repo_id,
      user_gh_id: plan.armory_info.author
    }));
    return null;
  },

  isLoaded () {
    return Session.get('loaded');
  },

  getStarCount() {
    let plan = Plans.findOne({ name: FlowRouter.getParam('_name') });

    Meteor.call('getNumbersOfStar', { repo_url: plan.short_description }, function(err, result) {
      if(!err)
        return result;
      else
        console.log(err);
    });
  },

  canStar(repo_id, template) {
    Meteor.call('isStarred', { repo_id: repo_id }, function(err, result) {
      if(result) {
        template.starCounter.set(getStarCount());
        template.canStar.set(result);
      }
      console.log('Shit2');
    });
  }
});

Template.plan.onRendered(() => {
  Session.set('loaded', true);
});

Template.plan.onCreated(() => {
  this.starCounter = new ReactiveVar();
  this.starCounter.set(0);
  this.canStar = new ReactiveVar();
  this.canStar.set(false);
});
