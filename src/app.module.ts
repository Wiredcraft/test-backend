import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { DBAccessModule } from "./dbaccess/dbaccess.module";
import { HealthModule } from "./health/health.module";
import { WinstonModule } from "nest-winston";
import winstonConfig from "./config/winston.config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { HttpLoggerMiddleware } from "./middlewares/http-logger.middleware";

@Module({
  imports: [
    UsersModule,
    DBAccessModule,
    HealthModule,
    WinstonModule.forRoot(winstonConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [DBAccessModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
