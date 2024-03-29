// import { TAPi18n } from 'meteor/tap:i18n';

// AccountsTemplates.configure({
//   showForgotPasswordLink: true,
//   texts: {
//     errors: {
//       loginForbidden: TAPi18n.__('Incorrect username or password'),
//       pwdMismatch: TAPi18n.__('Passwords don\'t match'),
//     },
//     title: {
//       signIn: TAPi18n.__('Sign In'),
//       signUp: TAPi18n.__('Join'),
//     },
//   },
//   defaultTemplate: 'Auth_page',
//   defaultLayout: 'App_body',
//   defaultContentRegion: 'main',
//   defaultLayoutRegions: {},
// });
Accounts.ui.config({ requestPermissions: { github: ['repo', 'user' ] } });

Meteor.loginWithGithub({
  requestPermissions: ['repo', 'user' ]
}, function (err) {
  if (err)
    if(err.message === "Login service configuration not yet loaded") {
      console.warn(err.message);
    } else {
      console.error(err.message);
      Session.set('error', err.message || 'Unknown error');
    }
});
