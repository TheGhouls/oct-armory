export const Saas = new Mongo.Collection('saas');

let Schemas = {};

Schemas.Saas = new SimpleSchema({
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

  topic: {
    type: String,
    label: "Topic"
  },

  message: {
    type: String,
    label: "Message"
  }
});

Saas.attachSchema(Schemas.Saas);
