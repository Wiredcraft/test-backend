import { Injectable } from "@nestjs/common";
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from "@nestjs/terminus";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaHealthIndicatorService extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$connect();
      return this.getStatus(key, true);
    } catch (e) {
      throw new HealthCheckError("Prisma check failed", e);
    } finally {
      await this.prismaService.$disconnect();
    }
  }
}
