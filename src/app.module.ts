import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserModule } from './application/user.module';
import { MongooseModule } from '@nestjs/mongoose';

const MONGO_SERVER = process.env.MONGO_SERVER || 'localhost';
@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(`mongodb://${MONGO_SERVER}/nest`),
  ],
  controllers: [UserController],
})
export class AppModule {}
