import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Plans } from '../../../../api/plans/plansCollections.es6.js';
import './myPlans.jade';

Template.myPlans.onCreated(function onCreatedmyPlans(){
  // Redirect the user if not logged in
  if(!Meteor.userId()) {
    return FlowRouter.go('/');
  }
  Meteor.subscribe('myPlans');
});

Template.myPlans.helpers({
  plans() {
    return Plans.find({}, { sort: { createdAt: -1 } });
  },
  displayPlans() {
    let plans = Plans.find({}, { sort: { createdAt: -1 } }).count();
    return plans > 0 ? true : false;
  },
});

Template.myPlans.events({
  'click .delete'() {
    taskId = this._id
    check(taskId, String);

    const task = Plans.findOne(taskId);
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Plans.remove(taskId);
    sAlert.success(task.name + ' was successfuly deleted !');
  },
});
