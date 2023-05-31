import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";
import { HttpModule } from "@nestjs/axios";
import { DBAccessModule } from "@wiredcraft/dbaccess/dbaccess.module";

@Module({
  imports: [TerminusModule, HttpModule, DBAccessModule],
  controllers: [HealthController],
})
export class HealthModule {}
