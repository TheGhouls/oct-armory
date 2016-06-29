import './nav.jade';

Template.nav.onCreated(function(){
  export const userId = Meteor.userId();
});

Template.nav.helpers({
  myPlanPath() {
    return (Meteor.userId() + '/plans');
  },

  myStarredPlanPath() {
    return (Meteor.userId() + '/stared')
  }
});
