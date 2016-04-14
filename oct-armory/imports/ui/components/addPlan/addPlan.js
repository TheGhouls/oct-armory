import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {GhHelper} from '../../../api/github/GhHelper.es6.js';
import {Session} from 'meteor/session';
import './addPlan.jade';
/*****************************************************************************/
/* Plan: Event Handlers */
/*****************************************************************************/
Template.addPlan.events({
  'click .addBp': (id = this) => {
    console.log(id.currentTarget.attributes.id.value);
    Session.set('error', id.currentTarget.attributes.id.value);
  }
});

/*****************************************************************************/
/* Plan: Helpers */
/*****************************************************************************/
Template.addPlan.helpers({
  ghRepos () {
    console.log(Session.get("getUserRepo"));
    return Session.get("getUserRepo");
  }

});

/*****************************************************************************/
/* Plan: Lifecycle Hooks */
/*****************************************************************************/
Template.addPlan.onCreated(function armoryAddPlanOnCreated() {
  console.log("onCreated plan");
});

Template.addPlan.onRendered(function () {
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