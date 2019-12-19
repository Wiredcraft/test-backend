import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
