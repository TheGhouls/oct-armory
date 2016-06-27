import './mainLayout.jade';
import {Session} from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';
//var Virt_Collection = new Meteor.Collection("virtual_coll");

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
 let self = this;
});

Template.mainLayout.helpers({

  currentUser (){
    return {
      _id: Meteor.userId(),
      name: Meteor.user().name
    }
  }

});


Template.mainLayout.onRendered(function () {
});
