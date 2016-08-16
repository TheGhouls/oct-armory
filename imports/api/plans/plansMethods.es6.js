import { Plans } from './plansCollections.es6.js';
//import { getRedis, setRedis } from '../redis/methods.js';

/**
 * [Check if repo is already in Redis and update Plan in Mongo if Plan need update]
 * @param Plan Mongo ID
 * @return {[void]} [Update repo if needed]
 */

Meteor.methods({
  checkForUpdate: function (battle_plan_id) {
    //unblocking client from waiting result
        this.unblock();
        GH_AUTH = Meteor.settings.public.githubApiKey;
        GH_API_URL = 'https://api.github.com/repos/';
        //console.log(Meteor.user().services.github.id);
        //user_gh_id = Meteor.user().services.github.id;
        try{
          battle_plan = Plans.findOne({_id: battle_plan_id});
        } catch(e){
          console.log("cant find the battle_plan to update in db", e);
        }
        if(Meteor.isServer){
          let repoToCheck = null;
          let readMeToCheck = null;
          let armoryToCheck = null;

          let repo_url = battle_plan.gh_repo_url.split("https://github.com/");
          repo_url = repo_url[1];
          const gh_api_request_armoryYAML = GH_API_URL + Meteor.user().services.github.username + "/" + battle_plan.name + "/contents/.armory.yaml?" + GH_AUTH;
          const gh_api_request_repo = GH_API_URL + repo_url + "?" + GH_AUTH;
          const gh_api_request_readme = GH_API_URL + repo_url + "/readme?" + GH_AUTH;

          function isRepoInRedis(repoId) {
            //let isInRedis = Meteor.call('getRedis', String(repoId));
            if (true == false){
              return true;
            }
            return false;
          }

          if(!isRepoInRedis(battle_plan_id)){
            try{
              repoToCheck = HTTP.get(gh_api_request_repo, { headers: { "User-Agent": "Meteor/1.3" } });
              readMeToCheck = HTTP.get(gh_api_request_readme, { headers: { "User-Agent": "Meteor/1.3" } });
              armoryToCheck = HTTP.get(gh_api_request_armoryYAML, { headers: { "User-Agent": "Meteor/1.3" } });
            } catch(e){
              console.log("cant acces to repo on github api ", e);
            }
            try{
              console.log("update mongo");
              console.log("readMeToCheck status ", readMeToCheck.headers.status);
              console.log("armoryToCheck status ", armoryToCheck.headers.status);
              console.log("repoToCheck content ", repoToCheck.content.name);
              console.log("readMeToCheck content ", readMeToCheck.content.name);
              console.log("armoryToCheck content ", armoryToCheck.content.name);
              //update mongo
              //updatePlan(battle_plan_id, repoToCheck);
            }catch(e){
              console.log("DB update error", e);
            }
            try{
              //Meteor.call('setRedis', String(battle_plan_id), battle_plan.gh_id);
              //update in redis
            }catch(e){
              console.log(e.error);
            }
          }else{
            return {succes: 'Plan is in cache'};
          }



          function isRepoChanged(repo, plan){
            let res = null;
            if (repo.title !== plan.title) {
              res = plan.update({_id: plan.id}, {title: repo.title});
            }
            if (repo.readme !== plan.readme){
              res = plan.update({_id: plan.id}, {readme: repo.readme});
            }
            if (repo.short_description !== plan.short_description) {
              res = plan.update({_id: plan.id}, {short_description: repo.short_description});
            }
            return res;
          }
        }
  }
});
// export const checkForUpdate = new ValidatedMethod({
//   name: 'checkForUpdate',

//   validate: new SimpleSchema({
//     battle_plan_id: { type: String }
//   }).validator(),

//   run({battle_plan_id}){
//     //unblocking client from waiting result
//     this.unblock();
//     GH_AUTH = Meteor.settings.public.githubApiKey;
//     GH_API_URL = 'https://api.github.com/repos/';

//     try{
//       battle_plan = Plans.findOne({_id: battle_plan_id});
//       let repo_url = battle_plan.gh_repo_url.split("https://github.com/");
//       repo_url = repo_url[1];
//       const gh_api_request_armoryYAML = GH_API_URL + user_gh_id + "/" + battle_plan.name + "/contents/.armory.yaml?" + GH_AUTH;
//       const gh_api_request_repo = GH_API_URL + repo_url + "?" + GH_AUTH;
//       const gh_api_request_readme = GH_API_URL + repo_url + "/readme" + GH_AUTH;
//     } catch(e){
//       console.log("cant find the battle_plan to update in db", e);
//     }

//     function isRepoInRedis(repoId) {
//       let isInRedis = Meteor.call('getRedis', String(repoId));
//       if (isInRedis){
//         return true;
//       }
//       return false;
//     }

//     if(!isRepoInRedis(battle_plan_id)){
//       try{
//         const repoToCheck = HTTP.get(gh_api_request_repo, { headers: { "User-Agent": "Meteor/1.3" } });
//         const readMeToCheck = HTTP.get(gh_api_request_readme, { headers: { "User-Agent": "Meteor/1.3" } });
//         const armoryToCheck = HTTP.get(gh_api_request_armoryYAML, { headers: { "User-Agent": "Meteor/1.3" } });
//       } catch(e){
//         console.log("cant acces to repo on github api ", e);
//       }
//       try{
//         //update mongo
//         updatePlan(battle_plan_id, )
//       }catch(e){

//       }
//       try{
//         Meteor.call('setRedis', String(battle_plan_id), battle_plan.gh_id);
//         //update in redis
//       }catch(e){
//         log(e.error)
//       }
//     }else{
//       return "{succes: 'Plan is in cache'}";
//     }



//     function isRepoChanged(repo, plan){
//       let res = null;
//       if (repo.title !== plan.title) {
//         res = plan.update({_id: plan.id}, {title: repo.title});
//       }
//       if (repo.readme !== plan.readme){
//         res = plan.update({_id: plan.id}, {readme: repo.readme});
//       }
//       if (repo.short_description !== plan.short_description) {
//         res = plan.update({_id: plan.id}, {short_description: repo.short_description});
//       }
//       return res;
//     }
//   }//end run()
// })

export const addPlan = new ValidatedMethod({
  name: 'addPlan',

  validate: new SimpleSchema({
    repo_gh_id: { type: String},
    user_gh_id: { type: String},
    repo: { type: [Object], blackbox: true}
  }).validator(),

  run({ repo_gh_id, user_gh_id, repo }){
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
      let x = _.where(repo, { name: repo_gh_id });
      let tmp;
      //console.log('x is: ', tmp = x[0].archive_url.replace('{archive_format}{ /ref }', 'zipball'));
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
          throw new Meteor.Error('plans.addPlan', "can't write the DB error is: " + e.message);
         }
      }
  }
});

export const updatePlan = new ValidatedMethod({
  name: 'updatePlan',

  validate: new SimpleSchema({
    repo_gh_id: { type: String},
    new_data: { type: Object, blackbox: true}
  }).validator(),

  run({repo_gh_id, new_data}){

  }
});

//PLAN RULES// // Must be CHanged I guess //
Plans.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});
