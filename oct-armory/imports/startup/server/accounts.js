Accounts.onCreateUser(function (options, user) {
  var accessToken = user.services.github.accessToken,
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

  user.gh_name = result.data.name;
  user.gh_login = result.data.login;
  user.gh_avata_url = result.data.avatar_url;
  user.gh_url = result.data.url;
  user.gh_company = result.data.company;
  user.gh_blog = result.data.blog;
  user.gh_location = result.data.location
  user.gh_email = result.data.email;
  user.gh_bio = result.data.bio;
  user.gh_html_url = result.data.html_url;

  // profile = _.pick(result.data,
  //   "name",  
	 //  "login",
  //   "avatar_url",
  //   "url",
  //   "company",
  //   "blog",
  //   "location",
  //   "email",
  //   "bio",
  //   "html_url");

  // user.profile = result.data;
  //user.everything = repo

  return user;
});