import { Module } from '@nestjs/common';
import { UserModule } from './interface/user/user.module';
import {PostgresModule} from "./infrastructure/postgres/postgres.module";

@Module({
  imports: [UserModule, PostgresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
