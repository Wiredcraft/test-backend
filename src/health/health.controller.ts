import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from "@nestjs/terminus";
import { PrismaHealthIndicatorService } from "@wiredcraft/dbaccess/prisma.health.indicator.service";

@Controller("health")
@ApiTags("System Health Status")
export class HealthController {
  constructor(
    private readonly http: HttpHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly dbHealth: PrismaHealthIndicatorService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.http.pingCheck(
          "basic check",
          `http://localhost:${process.env.PORT || 3000}`
        ),
      () => this.dbHealth.isHealthy("mongodb"),
      () =>
        this.disk.checkStorage("diskStorage", {
          thresholdPercent: 0.5,
          path: "/",
        }),
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
      () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),

      // Mongoose for MongoDB check
      // Redis check
    ]);
  }
}
