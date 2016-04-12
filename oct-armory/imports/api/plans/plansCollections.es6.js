Plans = new Mongo.Collection("plans");

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
		optional: true
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

	gh_repo_url: {
		type: String,
		label: "gh_repo_url",
		regEx: SimpleSchema.RegEx.Url,
		optional: true
	},

	gh_md_url: {
		type: String,
		label: "gh_md_url",
		regEx: SimpleSchema.RegEx.Url,
		optional: true
	},

	armory_info: {
		type: Object,
		label: "armory_info",
		optional: true
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