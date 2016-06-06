import './mainLayout.jade';
import {Session} from 'meteor/session';
import { getZmqSub } from '../../../api/saas/methods.js';

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
	this.autorun(() => {
	    console.log("onCreated mainLayout");
      getZmqSub.call({
            zmq_sock: "sock id"
          }, (err, res) => {
            if (err) {
              if (err.error === 404) {
                //log.error('404 getZmqSub: error', err.message, this.userId);
                console.log('404 getZmqSub: ', err.message)
                //sAlert.error('404 getZmqSub: error: '+err.message);
              } else {
                //log.error('unexpected error getZmqSub: ', err.message, this.userId);
                console.log('unexpected error getZmqSub: ', err.message)
                //sAlert.error('unexpected zmq: error: '+err.message);
              }
            } else {
              //sAlert.success('zmq successfully: '+res);
              console.log('succes getZmqSub', res);
            }
      });
	  });
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
