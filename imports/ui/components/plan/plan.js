import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GhHelper } from '../../../api/github/GhHelper.es6.js';
import { getRepoReadme, getReposArmory, getRepo} from '../../../api/github/methods.js';
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { log } from '../../../api/logger_conf.js';
import { ReactiveVar } from 'meteor/reactive-var';
import './plan.jade';

const PlansSub = Meteor.subscribe('plans');
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.plan.events({
  'click .addBp': (id = this) => {
    Session.set('error', id.currentTarget.attributes.id.value);
  }
});
/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.plan.helpers({
	getPlan () {
    let plan = null;
    if (!Session.get('plan')) {
      plan = Plans.findOne({name: FlowRouter.getParam('_name')});
      Session.set('plan', plan);
    } else {
      plan = Session.get('plan');
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
  }

});

Template.plan.onRendered(() => {
  Session.set('loaded', true);
});
