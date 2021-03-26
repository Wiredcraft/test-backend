import { Module } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { OnMemoryUserRepository } from '../infra/on-memory/user.repository';
import { UserAppService } from './user.service';

export const userRepositoryProvider = {
  provide: UserRepository,
  useClass: OnMemoryUserRepository,
};

@Module({
  imports: [],
  controllers: [],
  providers: [UserAppService, userRepositoryProvider],
  exports: [UserAppService],
})
export class UserModule {}
