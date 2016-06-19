import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { Saas } from './saasCollections.js';
import { ZmqHelper } from './pocZmq.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from "meteor/meteor";

export const getZmqSub = new ValidatedMethod({
  name: 'getZmqSub',

  validate: new SimpleSchema({
    zmq_sock: { type: String}
  }).validator(),
  run({zmq_sock}){
    //console.log('zmq_sock args: ', zmq_sock);
    if(Meteor.isServer) {

      function handle_message(topic, message) {
          //console.log("pull on message " + message);
          try{
            console.log("topic and message : ",topic.toString(), message.toString());
            Saas.insert({'owner': Meteor.userId, 'topic': topic.toString(), 'message': message.toString()});
          } catch(e){
            console.log("saas db error " + e);
          }
      }
      bound_handle_message = Meteor.bindEnvironment(handle_message, function(e) {
          console.log("exception! " + e);
      });
      try{
        const sock = ZMQ.socket('sub');
        try{
          sock.connect('tcp://192.168.99.100:5002');
        } catch(e){
          throw new Meteor.Error('getZmqSub', "cant connect getZmqSub: "+e);
          console.log(e);
        }
        sock.subscribe('oct-docker');
        //console.log('Subscriber connected');
        sock.on('message', bound_handle_message);
        return true;
      } catch(e) {
        throw new Meteor.Error('getZmqSub', "cant process getZmqSub: "+e);
        return false;
      }
    }
  }
});

export const setZmqPub = new ValidatedMethod({
  name: 'setZmqPub',

  validate: new SimpleSchema({
    zmq_sock: { type: String}
  }).validator(),
  run({zmq_sock}){
    console.log('setZmqPub args: ', zmq_sock);
    if(Meteor.isServer) {
      let helper = new ZmqHelper();
      helper.pubSock();
    }
    return true;
  }
});
