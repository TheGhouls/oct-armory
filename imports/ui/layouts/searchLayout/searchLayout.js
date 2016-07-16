import './searchLayout.jade';
import {Session} from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
//var Virt_Collection = new Meteor.Collection("virtual_coll");

Template.searchLayout.onCreated(function mainLayoutOnCreated() {
 let self = this;
});

Template.searchLayout.helpers({

  currentUser (){
    return {
      _id: Meteor.userId(),
      name: Meteor.user().name
    }
  }

});


Template.searchLayout.onRendered(function () {
});
