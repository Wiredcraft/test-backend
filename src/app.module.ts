import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DBAccessModule } from "./dbaccess/dbaccess.module";
import { HealthModule } from './health/health.module';

@Module({
  imports: [UsersModule, DBAccessModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [DBAccessModule],
})
export class AppModule {}
