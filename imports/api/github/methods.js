import { HTTP } from 'meteor/http';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { YAML } from 'meteor/udondan:yml';
import { Match } from 'meteor/check';
import { Plans } from '../plans/plansCollections.es6.js';
import { log, logRaven } from '../logger_conf.js';
import { ArmoryInfoSchema } from './ArmoryInfoSchema.js';

GH_AUTH = Meteor.settings.public.githubApiKey;
gitHubUrl = 'https://api.github.com/repos/'

export const getRepo = new ValidatedMethod({
  name: 'gh.getRepo',

  validate: new SimpleSchema({
    repo_gh_id: { type: String },
    user_gh_id: { type: String }
  }).validator(),
  run({ repo_gh_id, user_gh_id }){
    console.log('user gh id: ', user_gh_id);
    const gh_api_request = gitHubUrl + user_gh_id + "/" + repo_gh_id + "?" + GH_AUTH;
    //const userReposSync = Meteor.wrapAsync(HTTP.get );
    if(Meteor.isServer) {
      try{
        //const userRepos = userReposSync(gh_api_request, {});
        const userRepo = HTTP.get(gh_api_request, { headers:
          { "User-Agent": "Meteor/1.3" } });
        console.log("getRepo result: ", userRepo.data);
        return userRepo
      } catch(e) {
        throw new Meteor.Error('gh.getRepo.httperror', "cant process http call error is: " + e.message);
        console.log('getUserRepo error: ' + e.message);
        const userRepo = false;
        return userRepo;
      }
    }

  }
});

export const getRepoReadme = new ValidatedMethod({
  name: 'gh.getRepoReadme',

  validate: new SimpleSchema({
    user_gh_id: { type: String},
    repo_id: { type: String}
  }).validator(),

  run({user_gh_id, repo_id }){
    const gh_api_request = gitHubUrl+user_gh_id+"/"+repo_id+"/readme";
    try{
      const res = HTTP.call('GET', gh_api_request);
      return res;
    } catch(e) {
      throw new Meteor.Error('gh.getRepoReadme.httperror', "cant process http call error is: "+e);
      return e;
    }
  }
});

export const getRepoDlStat = new ValidatedMethod({
  name: 'gh.getRepoDlStat',

  validate: new SimpleSchema({
    user_gh_id: { type: String},
    repo_id: { type: String}
  }).validator(),

  run({user_gh_id, repo_id }){
    const gh_api_request = gitHubUrl + user_gh_id + "/" + repo_id + "/downloads";
    try{
      const res = HTTP.call('GET', gh_api_request);
      return res;
    } catch(e) {
      throw new Meteor.Error('gh.getRepoDlStat.httperror', "cant process http call error is: "+e);
      return e;
    }
  }
});


export const getReposArmory = new ValidatedMethod({
  name: 'gh.getReposArmory',

  validate: new SimpleSchema({
    user_gh_id: { type: String}
  }).validator(),

  run({user_gh_id}){
    let userRepos = null;
    const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id+"+fork:true&"+GH_AUTH;
    try{
      if(Meteor.isServer){
        userRepos = HTTP.get(gh_api_request, {headers:{"User-Agent": "Meteor/1.3"}});
        console.log("getReposArmory result: ", userRepos.data.total_count);
      }
    } catch(e) {
      throw new Meteor.Error('gh.getReposArmory.httperror', "cant process http call error is: $e");
      console.log('getReposArmory error: ', e);
      userRepos = false;
      return userRepos;
    }

    let res = getRepoHelper(user_gh_id, userRepos);
    if(Meteor.isServer){
      if(res.length == 0) {
        console.log("no Armory repositories found");
        //logRaven.log(new Meteor.Error('gh.getReposArmory.norepofound', "no Armory repositories found: "+res.length+" plan found for user: "+user_gh_id));
        throw new Meteor.Error('gh.getReposArmory.norepofound', "no Armory repositories found: "+res.length+" plan found for user: "+user_gh_id);
      } else {
        return res;
      }
    }

  }
});

/**
 * [getRepoHelper Check and return GitHub repository]
 * @param  {[String]} user_gh_id [User github id]
 * @param  {[Object]} userRepos  [user github repository list]
 * @return {[Array]}            [Return all valid armory repo]
 */
function getRepoHelper (user_gh_id, userRepos) {
  res = [];
  if(userRepos) {
    _.each(userRepos.data.items, (repo) => {
      let is_in_db = Plans.find({gh_repo_id: String(repo.id), owner: Meteor.user()._id}, {
       limit: 1
      }).count();

      //if repo is not already in db
      if (is_in_db <= 0) {
        console.log('is in db', is_in_db, Meteor.user()._id);
        let gh_api_request = gitHubUrl + user_gh_id + "/" + repo.name + "/contents/.armory.yaml?" + GH_AUTH;
        try{
          let tmp_res = HTTP.call('GET', gh_api_request, { headers: { "User-Agent": "Meteor/1.3" } });
          let readme = HTTP.call('GET', gitHubUrl + user_gh_id + "/" + repo.name + "/readme?" + GH_AUTH, { headers: { "User-Agent": "Meteor/1.3" } });
          /**
           * Decode yml file from base64 format and convert it to json for armory.yaml validation
           * Retunr repo obj extended with armory_info (yml converted to json)
           */
          let buf = new Buffer(tmp_res.data.content, 'Base64')
          let readme_decode = new Buffer(readme.data.content, 'Base64');
          try {
            let armory_info_json = YAML.safeLoad(buf.toString());
            isValid = Match.test(armory_info_json, ArmoryInfoSchema);
            if (isValid) {
              _.extend(repo, {readme: readme_decode.toString()});
              _.extend(repo, {armory_info: armory_info_json});
              res.push(repo);
            } else {
              let err = new Meteor.Error('gh.getReposArmory.notvalidarmory', "armory.yml is not valid: missing info");
              log.error('armory.yml is not valid: missing info ', err.message, this.userId);
              logRaven.log('armory.yml is not valid: missing info '+err.message+this.userId);
              console.log('armory.yml is not valid: missing info');
            }
          } catch (e) {
            let err = new Meteor.Error('gh.getReposArmory.notvalidarmory', "armory.yml is not valid: " + e.message);
            log.error('armory.yml is not valid: ', e.message, this.userId)
            console.log(e);
          }
        } catch(e) {
          //console.log("not an Armory repo: ", e.error);
        }
      }
    });
    return res;
  }

}
