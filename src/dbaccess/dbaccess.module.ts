import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaHealthIndicatorService } from "./prisma.health.indicator.service";

@Module({
  providers: [PrismaService, PrismaHealthIndicatorService],
  exports: [PrismaService, PrismaHealthIndicatorService],
})
export class DBAccessModule {}
