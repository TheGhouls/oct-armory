import "./saas.jade";
import { Saas } from '../../../api/saas/saasCollections.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { getZmqSub, setZmqPub } from '../../../api/saas/methods.js';
import { log } from '../../../api/logger_conf.js';


Template.saas.onCreated(function onCreatedSaas(){
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

  reactiveRes = new ReactiveDict('myRes');
  reactiveRes.set('res', Saas.find().count());
  getZmqSub.call({
        zmq_sock: "Get Sub"
      }, (err, res) => {
        if (err) {
          if (err.error === 404) {
            //log.error('404 getZmqSub: error', err.message, this.userId);
            console.log('404 getZmqSub: ', err.message)
            sAlert.error('404 getZmqSub: error: '+err.message);
          } else {
            //log.error('unexpected error getZmqSub: ', err.message, this.userId);
            console.log('unexpected error getZmqSub: ', err.message, err)
            sAlert.error('unexpected zmq: error: '+err.message);
          }
        } else {
          //log.info('success getZmqSub: ', res);
          sAlert.success('zmq successfully subscribe: '+res);
          console.log('succes getZmqSub', reactiveRes.get('res'));
        }
  });
  let Subs = self.subscribe("saas");
  reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
  self.autorun(() => {
    reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
    jsonRes = reactiveRes.get('res');
    try{
      jsonRes = JSON.parse(jsonRes[0].message);
      reactiveRes.set('jsonRes', jsonRes.elapsed);
      console.log('reactiveDict res:', reactiveRes.get('jsonRes'));
    } catch(e){
      console.warn("JSON parse error", e);
    }
  });
});


Template.saas.helpers({
  getRes (){
    return reactiveRes.get('jsonRes');
  }
});

