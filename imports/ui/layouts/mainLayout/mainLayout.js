import './mainLayout.jade';
import {Session} from 'meteor/session';
import { getZmqSub, setZmqPub } from '../../../api/saas/methods.js';
import { Saas } from '../../../api/saas/saasCollections.js';
import { ReactiveDict } from 'meteor/reactive-dict';
//var Virt_Collection = new Meteor.Collection("virtual_coll");

Template.mainLayout.onCreated(function mainLayoutOnCreated() {
  let self = this;
  /**
   * Uncomment for use local zmq server on port 4000
   */

  // setZmqPub.call({
  //   zmq_sock: "Set Pub"
  // }, (err, res) => {
  //     if (err) {
  //         //log.error('unexpected error getZmqSub: ', err.message, this.userId);
  //         console.log('unexpected error setZmqPub: ', err.message, err)
  //     } else {
  //       console.log('succes setZmqPub', res);
  //     }
  // });

  let reactiveRes = new ReactiveDict('myRes');
  reactiveRes.set('res', Saas.find().count());
  getZmqSub.call({
        zmq_sock: "Get Sub"
      }, (err, res) => {
        if (err) {
          if (err.error === 404) {
            //log.error('404 getZmqSub: error', err.message, this.userId);
            console.log('404 getZmqSub: ', err.message)
            //sAlert.error('404 getZmqSub: error: '+err.message);
          } else {
            //log.error('unexpected error getZmqSub: ', err.message, this.userId);
            console.log('unexpected error getZmqSub: ', err.message, err)
            //sAlert.error('unexpected zmq: error: '+err.message);
          }
        } else {
          sAlert.success('zmq successfully subscribe: '+res);

          console.log('succes getZmqSub', reactiveRes.get('res'));
        }
  });
  let Subs = self.subscribe("saas");
  reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
	self.autorun(() => {


      console.log('reactiveDict res:', reactiveRes.get('res'));
      //let res = new Meteor.Stream('zmq-res');

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
