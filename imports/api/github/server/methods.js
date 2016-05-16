import { HTTP } from 'meteor/http';
//import {Session} from 'meteor/session';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';


export const getUserRepo = new ValidatedMethod({
  name: 'gh.getUserRepo',

  validate: new SimpleSchema({
    user_gh_id: { type: String}
  }).validator(),
  run({user_gh_id}){
    const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id;
    const userReposSync = Meteor.wrapAsync(HTTP.get );
    try{
      //const userRepos = userReposSync(gh_api_request, {});
      if(isSimulation){const userRepos = HTTP.get(gh_api_request);}
      //const userRepos = HTTP.get(gh_api_request);
      console.log("getUserRepo result: ", userRepos);
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
    //const userRepos = '';

    if(userRepos) {
      res = [];
      _.each(userRepos, () => {
        const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo.name+"/contents/.armory.yml ";
        try{
          const tmp_res = HTTP.call('GET', gh_api_request);
          res.push(tmp_res);
          console.log(tmp_res);
        } catch(e) {
          console.log("not an Armory repo: ", e);
        }
      });
    } else if(!userRepos || res.length == 0) {
      Meteor.Error('gh.getReposArmory.norepofound', "no Armory repositories found");
    }
  }
});