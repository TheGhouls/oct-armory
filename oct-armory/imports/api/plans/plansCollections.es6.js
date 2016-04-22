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
		type: Object,
		label: "gh_readme",
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

// Plans.messages({
//   required: "[label] is required",
//   minString: "[label] must be at least [min] characters",
//   maxString: "[label] cannot exceed [max] characters",
//   minNumber: "[label] must be at least [min]",
//   maxNumber: "[label] cannot exceed [max]",
//   minDate: "[label] must be on or after [min]",
//   maxDate: "[label] cannot be after [max]",
//   badDate: "[label] is not a valid date",
//   minCount: "You must specify at least [minCount] values",
//   maxCount: "You cannot specify more than [maxCount] values",
//   noDecimal: "[label] must be an integer",
//   notAllowed: "[value] is not an allowed value",
//   expectedString: "[label] must be a string",
//   expectedNumber: "[label] must be a number",
//   expectedBoolean: "[label] must be a boolean",
//   expectedArray: "[label] must be an array",
//   expectedObject: "[label] must be an object",
//   expectedConstructor: "[label] must be a [type]",
//   regEx: [
//     {msg: "[label] failed regular expression validation"},
//     {exp: SimpleSchema.RegEx.Email, msg: "[label] must be a valid e-mail address"},
//     {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] must be a valid e-mail address"},
//     {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},
//     {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},
//     {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
//     {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
//     {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
//     {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
//     {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}
//   ],
//   keyNotInSchema: "[key] is not allowed by the schema"
// });