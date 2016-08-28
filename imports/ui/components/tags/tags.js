import { Template } from 'meteor/templating';
import './tags.jade';
import '../planBox/planBox.js';
import { Plans as Tags } from '../../../api/plans/plansCollections.es6.js';
import { ReactiveVar } from 'meteor/reactive-var'
Template.tags.events({
  'click': function () {
    // ...
  }
});

Template.tags.helpers({
  getTags() {
    let res = Tags.find({}).fetch();
    this.reactiveRes = new ReactiveVar(res);
    return this.reactiveRes.get();
  }
});

Template.tags.onCreated(function (){
  this.autorun(() => {
    tagsSub = this.subscribe("plansTags", FlowRouter.getParam('_tags'));
  });

});

Template.tags.onRendered(function() {

});

Template.tags.onDestroyed(function () {

});
