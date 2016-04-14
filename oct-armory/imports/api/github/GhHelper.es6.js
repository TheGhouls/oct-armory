//import GitHub from 'github/api/v3.0.0';
import { HTTP } from 'meteor/http';
import {Session} from 'meteor/session';

// Setup sync API
// const getFollowingFromUserFiber =
//   Meteor.wrapAsync(github.user.getFollowingFromUser, github.user);


export class GhHelper {
	constructor() {
	    this.nom = "GhHelper";
	}

	getUserRepo(user_gh_id) {
		console.log(user_gh_id);
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			Session.set("user_repos", res.data.items);
			
			});
	}

	getRepoReadme(user_gh_id, repo_id) {
		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/readme"; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			console.dir(res);
			Session.set("repo_readme", res.data.items);
			return Session.get("repo_readme");
			});
	}

	getRepoArmory(user_gh_id, repo_id) {
		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/contents/oct_armory.yml "; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			console.dir(res);
			Session.set("armory_yml", res.data.items);
			return Session.get("armory_yml");
			});
	}

	getRepoDlStat(user_gh_id, repo_id) {
		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/downloads"; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			console.dir(res);
			Session.set("repo_dl_stats", res.data.items);
			return Session.get("repo_dl_stats");
			});
	}

}

//export const Gh = new GhHelper();