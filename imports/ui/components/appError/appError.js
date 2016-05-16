import './appError.jade';
import {Session} from 'meteor/session';

Template.appError.events({
  'click .close': (event) => {
    Session.set('error', '');
  }
});

Template.appError.onCreated( () => {
 
});

Template.appError.onRendered( () => {
  
});