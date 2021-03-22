import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountModule } from './Account/AccountModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import BaseConfig from './Config/BaseConfig';
import { RedisModule } from 'nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';
import AppController from './AppController';
import { LoggerModule } from 'nestjs-pino';
import RequestIdMiddleware from './RequestIdMiddleware';
import { existsSync } from 'fs';
import { join } from 'path';

const loadConfig = () => {
  const mode = process.env.NODE_ENV || 'dev';
  const fileName =
    mode.replace(/^\w/, (str: string) => str.toUpperCase()) + 'Config';
  let configPath = join(__dirname, './Config/', fileName);

  if (mode === 'test') {
    configPath += '.ts';
  } else {
    configPath += '.js';
  }

  if (!existsSync(configPath)) {
    console.log(`[Config] ${fileName} Not Exist`);
    // process.exit(0);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(configPath).default;
};

@Module({
  imports: [
    //  Register ConfigModule
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [loadConfig()],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        prettyPrint: process.env.NODE_ENV !== 'production',
        useLevelLabels: true,
        level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
      },
    }),

    // Register Redis Module
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),

    // Register Mongo Module
    MongooseModule.forRootAsync({
      //Load config from ConfigService
      useFactory: (configService: ConfigService) => configService.get('mongo'),
      inject: [ConfigService],
    }),

    // Register Account Module
    AccountModule,
  ],

  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
