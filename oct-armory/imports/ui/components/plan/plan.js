import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
//import {GhHelper} from '../../api/github/GhHelper.es6.js';
import {Session} from 'meteor/session';
import './plan.jade';
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.plan.events({
});

/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.plan.helpers({
	ghName () {
		//let gh = new GhHelper();

		return Session.get("repo");;
	}

});

/*****************************************************************************/
/* Plan: Lifecycle Hooks */
/*****************************************************************************/
Template.plan.onCreated(function armoryHomeOnCreated() {
	console.log("onCreated plan");
});

Template.plan.onRendered(function () {
	console.log("onRendered plan");
});

Template.plan.onDestroyed(function () {
});