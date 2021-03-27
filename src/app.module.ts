import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserModule } from './application/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UserModule, MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [UserController],
})
export class AppModule {}
