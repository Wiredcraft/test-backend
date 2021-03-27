import { Module } from '@nestjs/common';
import { UserAppService } from './user.service';
import { MongoUserModule } from '../infra/mongo/user.module';

@Module({
  imports: [MongoUserModule],
  providers: [UserAppService],
  exports: [UserAppService],
})
export class UserModule {}
