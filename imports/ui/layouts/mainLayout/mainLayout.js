import './mainLayout.jade';
import {Session} from 'meteor/session';

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
	// this.autorun(() => {
	//     console.log("onCreated mainLayout");
	//   });
  //  
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