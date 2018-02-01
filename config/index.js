const Joi = require('joi');

require('dotenv').config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  BASE_PATH: Joi.string()
    .default('/'),
  PROXY_PATH: Joi.string()
    .default(''),
  PORT: Joi.number()
    .default(3000),
  MONGO_HOST: Joi.string()
    .description('Mongo DB host url')
    .required(),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongo: {
    host: envVars.MONGO_HOST,
  },
  basePath: envVars.BASE_PATH,
  proxyPath: envVars.PROXY_PATH
};

module.exports = config;
