import { Module } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { MongoUserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInMongo, UserSchema } from './user.schema';

export const userRepositoryProvider = {
  provide: UserRepository,
  useClass: MongoUserRepository,
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserInMongo.name, schema: UserSchema }]),
  ],
  providers: [userRepositoryProvider],
  exports: [userRepositoryProvider],
})
export class MongoUserModule {}
