import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
//import { AccountsTemplates } from 'meteor/useraccounts:core';

// // Import to load these templates
import '../../ui/layouts/mainLayout/mainLayout.js';
import '../../ui/pages/armoryHome.js';
import '../../ui/components/nav/nav.es6.js';
import '../../ui/components/search/search.js';
import '../../ui/components/plan/plan.js';
import '../../ui/components/appError/appError.js'
import '../../ui/components/addPlan/addPlan.js'
import '../../ui/components/notFound/notFound.js'

// import '../../ui/pages/app-not-found.js';

// // Import to override accounts templates
// import '../../ui/accounts/accounts-templates.js';
// 

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { nav: "nav", content: "notFound"});
  },
};

FlowRouter.route('/', {
    action: function() {
      BlazeLayout.render("mainLayout", {nav: "nav", content: "armoryHome"});
    }
});

let planSection = FlowRouter.group({
	prefix:"/plan"
});

planSection.route('/', {
    action: function() {
      BlazeLayout.render("mainLayout", {nav: "nav", content: "plan"});
    }
});

planSection.route('/add:gh_repo_id', {
    action: function(params, queryParams) {
      console.log("Params:", params);
      console.log("Query Params:", queryParams);
      BlazeLayout.render("mainLayout", {nav: "nav", content: "addPlan"});
    }
});

FlowRouter.route('/search:idm', {
  action: function(params, queryParams) {
    console.log("Params:", params);
    console.log("Query Params:", queryParams);
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
