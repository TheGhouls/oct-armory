import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import { Saas } from './saasCollections.js';
import { ZmqHelper } from './pocZmq.js';


export const getZmqSub = new ValidatedMethod({
  name: 'getZmqSub',

  validate: new SimpleSchema({
    zmq_sock: { type: String}
  }).validator(),
  run({zmq_sock}){
    console.log('zmq_sock args: ', zmq_sock);
    if(Meteor.isServer) {
      function handle_message(topic, message) {
          console.log("pull on message " + message);
          try{
            Saas.insert({'owner': Meteor.userId, 'topic': topic.toString(), 'message': message.toString() });
          } catch(e){
            console.log("saas db error " + e);
          }
      }

      bound_handle_message = Meteor.bindEnvironment(handle_message, function(e) {
          console.log("exception! " + e);
      });
      try{
        let helper = new ZmqHelper();
        //let res = new ReactiveVAr();
        helper.pubSock();
        //res = helper.subSock();
        const sock = ZMQ.socket('sub');
        //let res = new Future();
        sock.connect('tcp://127.0.0.1:4000');
        sock.subscribe('kitty cats');
        console.log('Subscriber connected to port 4000');

        sock.on('message', bound_handle_message);
      } catch(e) {
        throw new Meteor.Error('getZmqSub', "cant process getZmqSub: "+e);
        return 'res';
      }
    }
  }
});
