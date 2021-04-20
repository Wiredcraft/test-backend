import { Module } from '@nestjs/common';
import { UserModule } from './presentation/rest/user/user.module';
import { PostgresModule } from './infrastructure/postgres/postgres.module';

@Module({
  imports: [UserModule, PostgresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
