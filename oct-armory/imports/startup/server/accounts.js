Accounts.onCreateUser(function (options, user) {
  let accessToken = user.services.github.accessToken,
      result,
      profile;

  result = Meteor.http.get("https://api.github.com/user", {
		headers: {"User-Agent": "Meteor/1.0"},

    params: {
      access_token: accessToken
    }
  });

  repo = Meteor.http.get("https://api.github.com/user/repos", {
    headers: {"User-Agent": "Meteor/1.0"},

    params: {
      access_token: accessToken
    }
  });

  if (result.error)
    throw result.error;

  profile = _.pick(result.data,
    "name",  
	  "login",
    "avatar_url",
    "url",
    "company",
    "blog",
    "location",
    "email",
    "bio",
    "html_url");
  user = _.extend(user, profile);

  // user.profile = result.data;
  //user.everything = repo
  //Roles.addUsersToRoles(aliceUserId, 'user', Roles.GLOBAL_GROUP);
  return user;
});