import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
//import { AccountsTemplates } from 'meteor/useraccounts:core';

// // Import to load these templates
import '../../ui/layouts/mainLayout/mainLayout.js';
import '../../ui/layouts/searchLayout/searchLayout.js';
import '../../ui/pages/armoryHome.js';
import '../../ui/components/nav/nav.js';
import '../../ui/components/search/search.js';
import '../../ui/components/footer/footer.js';
import '../../ui/components/plan/plan.js';
import '../../ui/components/appError/appError.js';
import '../../ui/components/addPlan/addPlan.js';
import '../../ui/components/notFound/notFound.js';
import '../../ui/components/saas/saas.js';
import '../../ui/components/user/myPlans/myPlans.js';
import '../../ui/components/tags/tags.js';

// import '../../ui/pages/app-not-found.js';

// // Import to override accounts templates
// import '../../ui/accounts/accounts-templates.js';
//

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { nav: "nav", content: "notFound" });
  }
};

FlowRouter.route('/', {
    action: function() {
      BlazeLayout.render("mainLayout", { nav: "nav", content: "armoryHome" });
    },
});

//////////////////////////
// PLAN SECTION ROUTE  //
////////////////////////

let planSection = FlowRouter.group({
	prefix:"/plan"
});

planSection.route('/add/', {
  action: function(params, queryParams) {
    BlazeLayout.render("mainLayout", { nav: "nav", content: "addPlan" });
  }
});

planSection.route('/add/:_id', {
  action: function(params, queryParams) {
    BlazeLayout.render("mainLayout", { nav: "nav", content: "addPlan" });
  }
});


/////////////////////////
//      SASS ROUTE    //
///////////////////////


let saasSection = FlowRouter.group({
  prefix:"/saas"
});


saasSection.route('/test', {
  action: function(params, queryParams){
    BlazeLayout.render("mainLayout", { nav: "nav", content: "saas" })
  }
});

/////////////////////////
//    SEARCH ROUTE    //
///////////////////////


let searchSection = FlowRouter.group({
  prefix:"/search"
});

searchSection.route('/', {
  action: function(params, queryParams){
    BlazeLayout.render("searchLayout", { nav: "nav", content: "search" })
  }
});

searchSection.route('/:_name', {
  action: function(params, queryParams){
    BlazeLayout.render("searchLayout", { nav: "nav", content: "search" })
  }
});

/////////////////////////
//    USER ROUTE      //
///////////////////////

let userSection = FlowRouter.group({
  prefix:"/user"
});

userSection.route("/plans/", {
  action: function(params, queryParams) {
    BlazeLayout.render("mainLayout", { nav: "nav", content: "myPlans" });
  }
});

userSection.route("/:_username/:_name", {
  action: function(params, queryParams) {
    BlazeLayout.render("mainLayout", { nav: "nav", content: "plan" });
  }
});

/////////////////////////
//    TAGS ROUTE      //
///////////////////////

let tagsSection = FlowRouter.group({
  prefix: "/tags"
});

tagsSection.route('/:_tags', {
  action: function(params, queryParams){
    console.log("tags route params: ", params );
    console.log("tags route query params: ", queryParams);
    BlazeLayout.render("searchLayout", { nav: "nav", content: "tags" })
  }
});
