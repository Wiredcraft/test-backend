import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PrismaClientExceptionFilter } from "./filters/prisma-client-exception.filter";
import helmet from "helmet";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //use winston as default logger
  const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(winstonLogger);

  //secure headers
  app.use(helmet());
  //transform incoming data
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  //add global api prefix, e.g. /api/v1/users
  app.setGlobalPrefix(`api/${process.env.API_VERSION || "v1"}`, {
    exclude: [
      { path: "health", method: RequestMethod.GET },
      { path: "/", method: RequestMethod.GET },
    ],
  });
  //add prisma error filter show proper error message
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  //swagger only available for non production env
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Wirecard backend test")
      .setDescription("The User API description")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
  }

  await app.listen(PORT);
}
bootstrap();
