import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { RequestMethod, ValidationPipe } from "@nestjs/common";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix(process.env.API_VERSION || "v1", {
    exclude: [
      { path: "health", method: RequestMethod.GET },
      { path: "/", method: RequestMethod.GET },
    ],
  }); //set version for api

  //swagger only available for non production env
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("Wirecard backend test")
      .setDescription("The User API description")
      .setVersion("1.0")
      .addTag("users")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
  }

  await app.listen(PORT);
}
bootstrap();
