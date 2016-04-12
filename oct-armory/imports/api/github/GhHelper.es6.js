//import GitHub from 'github/api/v3.0.0';
import { HTTP } from 'meteor/http';
import {Session} from 'meteor/session';

// Setup sync API
// const getFollowingFromUserFiber =
//   Meteor.wrapAsync(github.user.getFollowingFromUser, github.user);


export class GhHelper {
	constructor() {
	    this.nom = "nom";
	  //   this.github = new GitHub({
   //   		version: "3.0.0", // required
   //   		timeout: 5000,
   //   		pathPrefix: "/api/v3",     // optional
 		// });
	}

	getName() {
		const u = Meteor.user().name;
		console.log(u);
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+u; 
		HTTP.call('GET', encodeURI(gh_api_request), (err,res) => {
			console.dir(res);
			Session.set("repo", res.data.items[0].full_name);
			});
	}

	getUserRepo(user_gh_id) {
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+user_gh_id; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			console.dir(res);
			Session.set("user_repos", res.data.items);
			return Session.get("user_repos");
			});
	}

	getRepoReadme(user_gh_id, repo_id) {
		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/readme"; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			console.dir(res);
			Session.set("user_repos", res.data.items);
			return Session.get("user_repos");
			});
	}

	getRepoArmory(user_gh_id, repo_id) {
		const gh_api_request = "https://api.github.com/repos/"+user_gh_id+"/"+repo_id+"/contents/oct_armory.yml "; 
		HTTP.call('GET', gh_api_request, (err,res) => {
			console.dir(res);
			Session.set("user_repos", res.data.items);
			return Session.get("user_repos");
			});
	}

	// getGhObj() {
	// 	return this.github;	
	// }

	// getUserRepo(user_gh_id) {
	// 	return github.search();
	// }

	// getUserGitId() {
	// 	const result = github.user.getFollowingFromUser({
	// 	    user: "aurelben"
	// 	});
	// 	return JSON.stringify(result);
	// }
}

//export const Gh = new GhHelper();