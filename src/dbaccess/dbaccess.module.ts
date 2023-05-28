import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaHealthIndicatorService } from "./prisma.health.indicator.service";
import { DBAccessService, DB_ACCESS_SERVICE } from "./dbaccess.service";

@Module({
  providers: [
    {
      useClass: DBAccessService,
      provide: DB_ACCESS_SERVICE,
    },
    PrismaService,
    PrismaHealthIndicatorService,
  ],
  exports: [DB_ACCESS_SERVICE, PrismaService, PrismaHealthIndicatorService],
})
export class DBAccessModule {}
