import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { AccessInterceptor } from './access.interception';
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './exception.filter';
import { ValidationPipe } from '@nestjs/common';

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AccessInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class AppModule {}
