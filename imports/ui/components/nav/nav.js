import './nav.jade';

Template.nav.events({
    'click .nav-search': (e) => {
      FlowRouter.go('/search');
    }
});
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
