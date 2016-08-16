import { client } from './server/redis_conf.js';


export const setRedis = new ValidatedMethod({
  name: 'setRedis',

  validate: new SimpleSchema({
    redis_key: { type: String},
    redis_val: { type: String}
  }).validator(),

  run({redis_key, redis_val}){
    return client.setSync(redis_key, redis_val);
  }
});

export const getRedis = new ValidatedMethod({
  name: 'getRedis',

  validate: new SimpleSchema({
    redis_key: { type: String},
    redis_val: { type: String}
  }).validator(),

  run({redis_key, redis_val}){
    return client.getSync(redis_key, redis_val);
  }
});
