export const Plans = new Mongo.Collection("plans");

let Schemas = {};
let mydate = new Date();
Schemas.Plan = new SimpleSchema({
	owner: {
		type: String,
		label: "Owner",
		regEx: SimpleSchema.RegEx.Id,
		autoValue: function () {
		      if (this.isInsert) {
		        return Meteor.userId();
			}
		},
		optional: true,
		index: true
	},

	owner_name: {
		type: String,
		label: "Owner",
		autoValue: function () {
		      if (this.isInsert) {
		        return Meteor.user().username;
			}
		},
		optional: true,
		index: true
	},

	create: {
		type: Date,
		    autoValue: function() {
		      if (this.isInsert) {
		        return new Date();
		      } else if (this.isUpsert) {
		        return {$setOnInsert: new Date()};
		      } else {
		        this.unset();  // Prevent user from supplying their own value
		      }
		    }
	},

	name: {
		type: String,
		label: "Name"
	},

	short_description: {
		type: String,
		label: "short_description",
		optional: true,
		index: true,
    unique: true
	},

	gh_repo_url: {
		type: String,
		label: "gh_repo_url",
		regEx: SimpleSchema.RegEx.Url,
		optional: false,
		index: true,
    unique: true
	},

	gh_clone_url: {
		type: String,
		label: "gh_clone_url",
		regEx: SimpleSchema.RegEx.Url,
		optional: false,
		index: true,
    unique: true
	},

	gh_repo_id: {
		type: String,
		label: "gh_repo_id",
		optional: false,
		index: true,
    unique: true
	},

	gh_readme: {
		type: String,
		label: "gh_readme",
		blackbox: true,
		optional: true
	},

	armory_info: {
		type: Object,
		label: "armory_info",
		optional: true,
		blackbox: true
	},

	gh_zip_url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		label: "gh_zip_url",
		optional: true
	},

	gh_tar_url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url,
		label: "gh_tar_url",
		optional: true
	},

	gh_stargazers_count: {
		type: String,
		label: "stargazers_count",
		optional: true
	},

	gh_watchers_count: {
		type: String,
		label: "watchers_count",
		optional: true
	},

	last_modif: {
		type: Date,
		    autoValue: function() {
		      if (this.isUpdate) {
		        return new Date();
		      }
		    },
		    denyInsert: true,
		    optional: true
	}
});

Plans.attachSchema(Schemas.Plan);
