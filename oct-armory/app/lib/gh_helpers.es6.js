var github = new GitHub({
    version: "3.0.0", // required
    timeout: 5000     // optional
});

GhHelper = function () {

	get_user_repo = function(user_gh_id){
		github.search()
	},

	get_user_gitid = function(){
		var result = github.user.getFollowingFromUser({
		    user: "aurelben"
		});

		console.log(JSON.stringify(result));
	}

}