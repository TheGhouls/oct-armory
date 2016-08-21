import { Plans } from './plansCollections.es6.js';
import { ArmoryInfoSchema } from '../github/ArmoryInfoSchema.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { YAML } from 'meteor/udondan:yml';
import { Match } from 'meteor/check';
import { log, logRaven } from '../logger_conf.js';
//import { getRedis, setRedis } from '../redis/methods.js';

/**
 * [Check if repo is already in Redis and update Plan in Mongo if Plan need update]
 * @param Plan Mongo ID
 * @return {[void]} [Update repo if needed]
 */
export const checkForUpdate = new ValidatedMethod({
  name: 'checkForUpdate',

  validate: new SimpleSchema({
    battle_plan_id: { type: String }
  }).validator(),

  run({battle_plan_id}){
    //unblocking client from waiting result
    this.unblock();
    if(Meteor.isServer){

      function isRepoInRedis(repoId) {
        let isInRedis = Meteor.call('getRedis', {redis_key: String(repoId)});
        console.log("isInRedis: ", isInRedis);
        if (isInRedis === repoId){
          return true;
        }
        return false;
      }

      if(!isRepoInRedis(battle_plan_id)){
        try{
          let res = Meteor.call('updatePlan', {battle_plan_id: battle_plan_id});
          console.log("isRepoInRedis update response ", res);
        }catch(e){
          log.error('plans.checkForUpdate DB update error ', e, e+" | "+this.userId+" | "+Meteor.user().name);
          logRaven.log('plans.checkForUpdate DB update error '+e+" | "+this.userId+" | "+Meteor.user().name);
          console.log("checkForUpdate DB update error", e);
        }
        try{
          let setInRedis = Meteor.call('setRedis', {redis_key: String(battle_plan_id), redis_val: String(battle_plan_id)});
          let setExpire = Meteor.call('setRedisExpire', {redis_key: String(battle_plan_id), key_expire: "600"} );
          console.log("setInRedis: ", setInRedis);
          console.log("setExpire: ", setExpire);
          //update in redis
        }catch(e){
          console.log(e);
        }
        return true;
      }else{
        return true;
      }
    }// end if(Meteor.isServer)
  }//end run()
})

export const addPlan = new ValidatedMethod({
  name: 'addPlan',

  validate: new SimpleSchema({
    repo_gh_id: { type: String},
    user_gh_id: { type: String},
    repo: { type: [Object], blackbox: true}
  }).validator(),

  run({ repo_gh_id, user_gh_id, repo }){
    if (!Meteor.userId()) {
      log.error('plans.addPlan not-authorized ', e, e+" | "+this.userId+" | "+Meteor.user().name);
      logRaven.log('plans.addPlan not-authorized '+e+" | "+this.userId+" | "+Meteor.user().name);

      throw new Meteor.Error('not-authorized');
    }
      let x = _.where(repo, { name: repo_gh_id });
      let tmp;
      //console.log('x is: ', x[0]);
      if (Meteor.isServer){
        try {
          res = Plans.insert({
            name: x[0].name,
            short_description: x[0].description || "Pleas add a description to your GItHub repository",
            armory_info: x[0].armory_info,
            gh_repo_url: x[0].html_url,
            gh_clone_url: x[0].clone_url,
            gh_repo_id: String(x[0].id),
            gh_readme: x[0].readme,
            gh_zip_url: x[0].archive_url.replace('{archive_format}{/ref}', 'zipball'),
            gh_tar_url: x[0].archive_url.replace('{archive_format}{/ref}', 'tarball'),
            gh_stargazers_count: x[0].stargazers_count,
            gh_watchers_count: x[0].watchers_count
            });
          return res;
        } catch (e) {
          log.error('plans.addPlan cant write the DB error is: ', e, e+" | "+this.userId+" | "+Meteor.user().name);
          logRaven.log('plans.addPlan cant write the DB error is: '+e+" | "+this.userId+" | "+Meteor.user().name);
          throw new Meteor.Error('plans.addPlan', "can't write the DB error is: " + e.message);
         }
      }
  }
});

export const updatePlan = new ValidatedMethod({
  name: 'updatePlan',

  validate: new SimpleSchema({
    battle_plan_id: { type: String }
  }).validator(),

  run({battle_plan_id}){
    if (Meteor.isServer){
      GH_AUTH = Meteor.settings.public.githubApiKey;
      GH_API_URL = 'https://api.github.com/repos/';
      try{
        battle_plan = Plans.findOne({_id: battle_plan_id});
      } catch(e){
        log.error('plans.updatePlan cant find the battle_plan to update in db ', e, e+" | "+this.userId+" | "+Meteor.user().name);
        logRaven.log('plans.updatePlan cant find the battle_plan to update in db '+e+" | "+this.userId+" | "+Meteor.user().name);
      }
      let repo_url = battle_plan.gh_repo_url.split("https://github.com/");
      repo_url = repo_url[1];
      const gh_api_request_armoryYAML = GH_API_URL + Meteor.user().services.github.username + "/" + battle_plan.name + "/contents/.armory.yaml?" + GH_AUTH;
      const gh_api_request_repo = GH_API_URL + repo_url + "?" + GH_AUTH;
      const gh_api_request_readme = GH_API_URL + repo_url + "/readme?" + GH_AUTH;
      try{
        repoToCheck = HTTP.get(gh_api_request_repo, { headers: { "User-Agent": "Meteor/1.3" } });
        readMeToCheck = HTTP.get(gh_api_request_readme, { headers: { "User-Agent": "Meteor/1.3" } });
        armoryToCheck = HTTP.get(gh_api_request_armoryYAML, { headers: { "User-Agent": "Meteor/1.3" } });
      } catch(e){
        log.error('plans.updatePlan cant acces to repo on github api ', e, e+" | "+this.userId+" | "+Meteor.user().name);
        logRaven.log('plans.updatePlan cant acces to repo on github api '+e+" | "+this.userId+" | "+Meteor.user().name);
        console.log("cant acces to repo on github api ", e);
      }
      try {
        let jsonRepo = {
            name: repoToCheck.data.name,
            short_description: repoToCheck.data.short_description || "Pleas add a description to your GItHub repository",
            armory_info: armoryToCheck.data.content,
            gh_repo_url: repoToCheck.data.html_url,
            gh_clone_url: repoToCheck.data.clone_url,
            gh_repo_id: String(repoToCheck.data.id),
            gh_readme: readMeToCheck.data.content,
            gh_zip_url: repoToCheck.data.archive_url.replace('{archive_format}{/ref}', 'zipball'),
            gh_tar_url: repoToCheck.data.archive_url.replace('{archive_format}{/ref}', 'tarball'),
            gh_stargazers_count: repoToCheck.data.stargazers_count,
            gh_watchers_count: repoToCheck.data.watchers_count
            };
        jsonRepo = prepareBpJson(jsonRepo, armoryToCheck, readMeToCheck);
        res = Plans.update({_id: String(battle_plan_id)}, {$set: jsonRepo});
        return res;
      } catch (e) {
        log.error('plans.updatePlan cant update the DB error is: ', e, e+" | "+this.userId+" | "+Meteor.user().name);
        logRaven.log('plans.updatePlan cant update the DB error is: '+e+" | "+this.userId+" | "+Meteor.user().name);
        throw new Meteor.Error('plans.updatePlan', "can't update the DB error is: " + e.message);
       }
    }
    return battle_plan_id;
  }
});

/**
 * [decode and check armory_info.yml and decode
 * readme and extend object before using it
 * for update db]
 * @param  {Object} jsonRepo   [the js object to use with mongo $set]
 * @param  {Object} armoryYaml [the response from gh api for armory_infi.yaml]
 * @param  {Object} readme     [the response from gh api for readme.md]
 * @return {Object}            [Updated object with base64 decoded readme and armoty_info]
 */
let prepareBpJson = (jsonRepo, armoryYaml, readme) => {
  let buf = new Buffer(armoryYaml.data.content, 'Base64')
  let readme_decode = new Buffer(readme.data.content, 'Base64');
  try {
    let armory_info_json = YAML.safeLoad(buf.toString());
    isValid = Match.test(armory_info_json, ArmoryInfoSchema);
    if (isValid) {
      _.extend(jsonRepo, {gh_readme: readme_decode.toString()});
      _.extend(jsonRepo, {armory_info: armory_info_json});
    } else {
      let err = new Meteor.Error('plans.updatePlan.notvalidarmory', "armory.yml is not valid: missing info");
      log.error('armory.yml is not valid: missing info ', err.message, this.userId+" | "+this.userName);
      logRaven.log('plans.updatePlan armory.yml is not valid: missing info '+err.message+this.userId+" | "+this.userName);
      console.log('plans.updatePlan armory.yml is not valid: missing info');
    }
  } catch (e) {
    let err = new Meteor.Error('plans.updatePlan.notvalidarmory', "armory.yml is not valid: " + e.message);
    log.error('plans.updatePlan armory.yml is not valid: ', e.message, this.userId)
    console.log(e);
  }
  return jsonRepo;
}

//PLAN RULES// // Must be CHanged I guess //
Plans.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});
