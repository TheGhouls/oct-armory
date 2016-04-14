import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {GhHelper} from '../../../api/github/GhHelper.es6.js';
import {Session} from 'meteor/session';
import './plan.jade';
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
	ghRepos () {
		console.log(Session.get("user_repos"));
    return Session.get("user_repos");
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
    if (Meteor.user()) {
      let gh = new GhHelper();
      let res = gh.getUserRepo(Meteor.user().services.github.username);
      let readme = gh.getRepoReadme(Meteor.user().services.github.username,"erp_meteor");
      console.log(res);
      console.log(readme);
    }
  });
});

Template.plan.onDestroyed(function () {
});