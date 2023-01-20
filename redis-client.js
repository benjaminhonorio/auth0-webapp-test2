const redis = require('redis');
const session = require('express-session');
require('dotenv').config();

let RedisStore = require('connect-redis')(session);
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL,
  });
} else {
  redisClient = redis.createClient();
}
redisClient.on('error', (err) =>
  console.log(`Fail to connect with redis. ${err}`)
);
redisClient.on('connect', () =>
  console.log('Successful connection with redis')
);

const store = new RedisStore({ client: redisClient });

module.exports = { store };
