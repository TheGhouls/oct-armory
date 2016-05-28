import {SimpleSchema} from 'meteor/aldeed:simple-schema';


export const ArmoryInfoSchema = new SimpleSchema({
  name: {
      type: String,
      label: "Name",
      max: 200,
      optional: true
    },
  author: {
      type: String,
      label: "Author",
      optional: true
    },
  readme: {
    type: String,
    optional: true
  },

  license: {
    type: String,
    optional: true
  },

  turrets: {
    type: [String],
    optional: true
  },
  global_configuration: {
    type: [String],
    optional: true
  },

  extra_turret_config: {
    type: [String],
    optional: true
  },

  tags: {
    type: [String],
    optional: true
  },

  dependencies: {
    type: [String],
    optional: true
  }
});