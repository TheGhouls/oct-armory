import { HTTP } from 'meteor/http';
//import {Session} from 'meteor/session';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

GH_AUTH = "?client_id=75d49ee4c41e3460be5a"+"&client_secret=0119f2cccacf11d39cf9452ffd830021dfafe710";
export const getUserRepo = new ValidatedMethod({
  name: 'gh.getUserRepo',

  validate: new SimpleSchema({
    user_gh_id: { type: String}
  }).validator(),
  run({user_gh_id}){
    const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id;
    //const userReposSync = Meteor.wrapAsync(HTTP.get );
    try{
      //const userRepos = userReposSync(gh_api_request, {});
      const userRepos = HTTP.get(gh_api_request, {headers:
        {"User-Agent": "Meteor/1.3"}});
      console.log("getUserRepo result: ", userRepos.data);
      return userRepos
    } catch(e) {
      Meteor.Error('gh.getUserRepo.httperror', "cant process http call error is: $e");
      console.log('getUserRepo error: ', e);
      const userRepos = false;
      return userRepos;
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
    const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/readme";
    try{
      const res = HTTP.call('GET', gh_api_request);
      return res;
    } catch(e) {
      Meteor.Error('gh.getRepoReadme.httperror', "cant process http call error is: "+e);
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
    const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/downloads";
    try{
      const res = HTTP.call('GET', gh_api_request);
      return res;
    } catch(e) {
      Meteor.Error('gh.getRepoDlStat.httperror', "cant process http call error is: "+e);
      return e;
    }
  }
});

export const getReposArmory = new ValidatedMethod({
  name: 'gh.getReposArmory',

  validate: new SimpleSchema({
    user_gh_id: { type: String},
    repo_id: { type: String}
  }).validator(),
  
  run({user_gh_id, repo_id }){
    console.log(user_gh_id);
    console.log(repo_id);
    let userRepos = 0;
    //const userReposSync = Meteor.wrapAsync(HTTP.get );
    const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id;
    try{
      //const userRepos = userReposSync(gh_api_request, {});
      userRepos = HTTP.get(gh_api_request, {headers:
        {"User-Agent": "Meteor/1.3"}});
      console.log("getUserRepo result: ", userRepos.data.total_count);
      //return userRepos
    } catch(e) {
      Meteor.Error('gh.getUserRepo.httperror', "cant process http call error is: $e");
      console.log('getUserRepo error: ', e);
      userRepos = false;
      //return userRepos;
    }

    if(userRepos) {
      console.info("in if");
      res = [];
      _.each(userRepos.data.items, (repo) => {
        let gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo.name+"/contents/.armory.yaml"+GH_AUTH;
        try{
          console.log(repo.name);
          //tmp_res = {};
          const tmp_res = HTTP.call('GET', gh_api_request, {headers: {"User-Agent": "Meteor/1.3"}});
          res.push(tmp_res);
          console.log(tmp_res);
        } catch(e) {
          console.log("not an Armory repo: ", e.message);
        }
      });
    } else if(!userRepos || res.length == 0) {
      Meteor.Error('gh.getReposArmory.norepofound', "no Armory repositories found");
    }
  }
});