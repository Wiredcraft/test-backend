import { Module } from '@nestjs/common';
import { UserModule } from './presentation/rest/user/user.module';
import { PostgresModule } from './infrastructure/postgres/postgres.module';
import { AppController } from './presentation/rest/app/app.controller';

@Module({
  imports: [UserModule, PostgresModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
