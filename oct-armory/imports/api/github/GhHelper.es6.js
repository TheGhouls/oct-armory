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
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id;
		const userReposSync = Meteor.wrapAsync((gh_api_request, callback) => {
			HTTP.call('GET', gh_api_request, (err, res) => {callback(err, {res: res})}) ;
		});
		try{
			const userRepos = userReposSync(gh_api_request);
			console.log("userRepos result: ", userRepos);
		} catch(e) {
			Meteor.Error('gh.getReposArmory.httperror', "cant process http call error is: $e");
			console.log('userRepos error: ', e);
			const userRepos = false;
		}

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

//export const Gh = new GhHelper();