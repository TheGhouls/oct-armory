import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import './armoryHome.jade';
/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.armoryHome.events({
	'click .search': (e) => {
    FlowRouter.go('/search');
  }

});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.armoryHome.helpers({
	ghName () {
		//console.log(Session.get("user_repos"));
		return Session.get("user_repos");
	}
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.armoryHome.onCreated(function armoryHomeOnCreated() {
});

Template.armoryHome.onRendered(function () {
});

Template.armoryHome.onDestroyed(function () {
});
