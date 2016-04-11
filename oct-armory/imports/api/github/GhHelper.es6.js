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
		
		
		const u = Meteor.user().services.github.username;
		console.log(u);
		const gh_api_request = "https://api.github.com/search/repositories?q=+user:"+u; 
		HTTP.call('GET', encodeURI(gh_api_request), (err,res) => {
			console.dir(res);
			Session.set("repo", res.data.items[0].full_name);
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