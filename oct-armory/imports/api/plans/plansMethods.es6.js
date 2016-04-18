import {Session} from 'meteor/session';


export const addPlan = new ValidatedMethod({
  name: 'plan.addPlan',

  validate: new SimpleSchema({
    repo_gh_id: { type: String},
    user_gh_id: { type: String},
    param: { type: String}

  }).validator(),
  run({repo_gh_id, user_gh_id, param}){
    let x = _.where(Session.get('getReposArmory'), {name: param});
    console.log('x is: ', x);
    Plan = new Mongo.Collection('plans');
      Plan.insert(
        {armory_info: x[0].armory_info}, (err, res) => {
          console.log('succes add plan: ', res);
          console.error('fail add plan: ', err);
        });

  }
});