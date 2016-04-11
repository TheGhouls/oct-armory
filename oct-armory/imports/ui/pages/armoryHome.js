import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {GhHelper} from '../../api/github/GhHelper.es6.js';
import {Session} from 'meteor/session';
import './armoryHome.jade';
/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.armoryHome.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.armoryHome.helpers({
	ghName () {
		//let gh = new GhHelper();

		return Session.get("repo");;
	}

});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.armoryHome.onCreated(function armoryHomeOnCreated() {
	// this.autorun(() => {
	// 	let gh= new GhHelper();

	//     console.log(gh.getName());
	//   });
	console.log("onCreated armoryHome");
});

Template.armoryHome.onRendered(function () {
	let gh = new GhHelper();
	//name = gh.getName(); 
	console.log(gh.getName());
	console.log("onRendered armoryHome");
});

Template.armoryHome.onDestroyed(function () {
});