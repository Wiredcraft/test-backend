import { EggAppInfo } from 'egg';

import { DefaultConfig } from './config.types';

export default (appInfo: EggAppInfo): DefaultConfig => {
  const config = {} as DefaultConfig;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602294995416_4568';

  config.security = {
    csrf: false,
  };

  // add your config here
  config.middleware = ['jwtAuth'];

  config.midwayFeature = {
    replaceEggLogger: true,
  };

  // 数据库配置
  config.mongoose = {
    client: {
      uri: 'mongodb://localhost:27017/test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: 'admin',
        pass: '123456',
      },
      // 关联实体
    },
  };

  // redis config
  config.redis = {
    client: {
      port: +process.env.REDIS_PORT || 6379, // Redis port
      host: process.env.REDIS_HOST || '127.0.0.1', // Redis host
      password: process.env.REDIS_PASSWORD || '',
      db: +process.env.REDIS_DB || 0,
    },
  };

  // swagger文档配置，默认地址 http://127.0.0.1:7001/swagger-ui/index.html
  config.swagger = {
    title: 'service-test',
    description: 'service-test project',
    version: '1.1.0',
    license: {
      name: 'MIT',
      url: 'https://github.com/midwayjs/midway/blob/serverless/LICENSE',
    },
  };

  // snowflake id generator config
  // '2020-01-01T00:00:00Z'
  const epoch = 1577836800000;
  config.koid = {
    dataCenter: 0,
    worker: 0,
    epoch,
  };

  // rabbitmq adminurl:  http://127.0.0.1:15672/
  config.rabbitmq = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
  };

  return config;
};
