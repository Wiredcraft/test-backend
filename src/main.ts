import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Wirecard backend test")
    .setDescription("The User API description")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(PORT);
}
bootstrap();
