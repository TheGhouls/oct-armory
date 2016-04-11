/**
 * Group route for plans section of app
 * @type {[type]}
 */
var planSection = FlowRouter.group({
    prefix: "/plans"
});

planSection.route('/', {
    action: function() {}
});

planSection.route('/getplan:id', {
    action: function(params, queryParams) {}
});

planSection.route('/newplan', {
    action: function() {}
});