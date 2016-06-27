import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { GhHelper } from '../../../api/github/GhHelper.es6.js';
import { getRepoReadme, getReposArmory, getRepo} from '../../../api/github/methods.js'
import { addPlan } from '../../../api/plans/plansMethods.es6.js';
import { Session } from 'meteor/session';
//import { Plans } from '../../../api/plans/plansCollections.es6.js';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { log } from '../../../api/logger_conf.js';
import './plan.jade';

//const Plans = Meteor.subscribe('plans');
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
		console.log(Session.get("getPlan"));
    //Session.set('loaded', true);
    return Session.get("getPlan");
	},

  isLoaded () {
    return Session.get('loaded');
  }

});

/*****************************************************************************/
/* Plan: Lifecycle Hooks */
/*****************************************************************************/
Template.plan.onCreated(function armoryPlanOnCreated() {
});

Template.plan.onRendered(function () {
  this.autorun(() => {
    let param = FlowRouter.getParam("_name");
    try {
      let res = Plans.findOne({
        name: param
        /*
        sort: Sort specifier,
        skip: Number,
        fields: Field specifier,
        reactive: Boolean,
        transform: Function
        */
      });
      Session.set('getPlan', res);
      Session.set('loaded', true);

    } catch(err) {
      log.error('getPlan error: ', err.message, this.userId);
      sAlert.error(TAPi18n.__("get_plan.errors.get"));
      Session.set('loaded', true);

    }

  });
});

Template.plan.onDestroyed(function () {
});
