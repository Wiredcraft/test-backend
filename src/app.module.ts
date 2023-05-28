import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DBAccessModule } from "./dbaccess/dbaccess.module";
import { HealthModule } from "./health/health.module";
import { WinstonModule } from "nest-winston";
import winstonConfig from "./config/winston.config";
import { RequestLoggingMiddleware } from "./middlewares/request-logging.middleware";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    UsersModule,
    DBAccessModule,
    HealthModule,
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === "production"
          ? join(__dirname, "public")
          : join(__dirname, "..", "public"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [DBAccessModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes("*");
  }
}
