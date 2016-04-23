//import GitHub from 'github/api/v3.0.0';
import { HTTP } from 'meteor/http';
import {Session} from 'meteor/session';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export class GhHelper {
	constructor() {
	    this.nom = "GhHelper";
	}

	getUserRepo(user_gh_id) {
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			Session.set("getUserRepo", res.data.items);		
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
			Session.set("getRepoReadme", res.data.items);
			return Session.get("getRepoReadme");
		});
	}

	getReposArmory(user_gh_id, repos_id) {

		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/contents/oct_armory.yml "; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			if(err){
				console.log("error:", err);
				return Session.set("error", err);
			}
			console.dir(res);
			Session.set("getReposArmory", res.data.items);
			return Session.get("getReposArmory");
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
			Session.set("getRepoDlStat", res.data.items);
			return Session.get("getRepoDlStat");
			});
	}

}


//export const Gh = new GhHelper();