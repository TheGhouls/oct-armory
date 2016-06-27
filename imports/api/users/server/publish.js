Meteor.publish('userData', function () {
  return Meteor.users.find({}, { fields: { profile: 1 } });
});

Meteor.publish("getUserData", function () {
    return Meteor.users.find( {_id: this.userId} );
});
