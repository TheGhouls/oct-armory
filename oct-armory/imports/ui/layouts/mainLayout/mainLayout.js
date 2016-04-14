import './mainLayout.jade';
import {Session} from 'meteor/session';

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
	// this.autorun(() => {
	//     console.log("onCreated mainLayout");
	//   });
  //  
});

Template.mainLayout.helpers({
 getError () {
    return Session.get("error");
  }
});


Template.mainLayout.onRendered(function () {
});