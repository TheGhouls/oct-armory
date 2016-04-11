import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

// // Import to load these templates
import '../../ui/layouts/mainLayout/mainLayout.js';
import '../../ui/pages/armoryHome.js';
import '../../ui/components/nav/nav.es6.js';
import '../../ui/components/plan/plan.js';

// import '../../ui/pages/app-not-found.js';

// // Import to override accounts templates
// import '../../ui/accounts/accounts-templates.js';
// 


FlowRouter.route('/', {
    action: function() {
      BlazeLayout.render("mainLayout", {nav: "nav", content: "armoryHome"});
    }
});

var planSection = FlowRouter.group({
	prefix:"/plan"
});

planSection.route('/', {
    action: function() {
      BlazeLayout.render("mainLayout", {nav: "nav", content: "plan"});
    }
});

// FlowRouter.route('/lists/:_id', {
//   name: 'Lists.show',
//   action() {
//     BlazeLayout.render('App_body', { main: 'Lists_show_page' });
//   },
// });

// FlowRouter.route('/', {
//   name: 'App.home',
//   action() {
//     BlazeLayout.render('App_body', { main: 'app_rootRedirector' });
//   },
// });

// // the App_notFound template is used for unknown routes and missing lists
// FlowRouter.notFound = {
//   action() {
//     BlazeLayout.render('App_body', { main: 'App_notFound' });
//   },
// };

// AccountsTemplates.configureRoute('signIn', {
//   name: 'signin',
//   path: '/signin',
// });

// AccountsTemplates.configureRoute('signUp', {
//   name: 'join',
//   path: '/join',
// });

// AccountsTemplates.configureRoute('forgotPwd');

// AccountsTemplates.configureRoute('resetPwd', {
//   name: 'resetPwd',
//   path: '/reset-password',
// });
// 
