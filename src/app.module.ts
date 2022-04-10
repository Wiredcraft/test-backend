import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:root123@127.0.0.1:3717/test?authSource=admin',
    ),
    WinstonModule.forRoot({
      // options
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
