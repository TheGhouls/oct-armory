import { client } from './server/redis_conf.js';


export const setRedis = new ValidatedMethod({
  name: 'setRedis',

  validate: new SimpleSchema({
    redis_key: { type: String },
    redis_val: { type: String }
  }).validator(),

  run({redis_key, redis_val}){
    return client.setSync(redis_key, redis_val);
  }
});

export const getRedis = new ValidatedMethod({
  name: 'getRedis',

  validate: new SimpleSchema({
    redis_key: { type: String }
  }).validator(),

  run({redis_key}){
    return client.getSync(redis_key);
  }
});

export const setRedisExpire = new ValidatedMethod({
  name: 'setRedisExpire',

  validate: new SimpleSchema({
    redis_key: { type: String },
    key_expire: { type: String }
  }).validator(),

  run({redis_key, key_expire}){
    return client.setExpire(redis_key, key_expire);
  }
});
