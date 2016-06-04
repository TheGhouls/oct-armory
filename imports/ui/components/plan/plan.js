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
    console.log(id.currentTarget.attributes.id.value);
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
	console.log("onCreated plan");
});

Template.plan.onRendered(function () {
	console.log("onRendered plan");
  this.autorun(() => {
    let param = FlowRouter.getParam("_name");
    console.log('param is: ', param);
    try{
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
      console.log('getPlan success: ', res);
      Session.set('getPlan', res);
      Session.set('loaded', true);

    } catch(err) {
      log.error('getPlan error: ', err.message, this.userId);
      console.log('getPlan error: ', err.message);
      sAlert.error('getPlan error: '+err.message);
      Session.set('loaded', true);

    }

  });
});

Template.plan.onDestroyed(function () {
});
