import { Plans } from '../plansCollections.es6.js';

Meteor.publish('plans', function() {
  return Plans.find({
    userId: { $exists: false }
  }, {
    fields: Plans.owner,
    fields: Plans.create,
    fields: Plans.name,
    fields: Plans.short_description,
    fields: Plans.gh_readme,
    fields: Plans.gh_zip_url,
    fields: Plans.gh_stargazers_count,
    fields: Plans.gh_watchers_count,
    fields: Plans.last_modif
  });
});
