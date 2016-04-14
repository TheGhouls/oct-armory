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
		console.log(Session.get("user_repos"));
		return Session.get("user_repos");
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
	console.log("onRendered armoryHome");
	// this.autorun(() => {
	// 		let gh = new GhHelper();
	// 		let res = gh.getUserRepo(Meteor.user().services.github.username);
	// 		let readme = gh.getRepoReadme(Meteor.user().services.github.username,"erp_meteor");
	// 		console.log(res);
		
	// 	console.log(Meteor.user().services.github);

	// });
		
});

Template.armoryHome.onDestroyed(function () {
});