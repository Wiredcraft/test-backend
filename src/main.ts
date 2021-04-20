import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomErrorFilter } from './presentation/rest/custom.error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Wiredcraft assignment')
    .setDescription('Test backend for user, friends and geolocation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomErrorFilter());
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}

bootstrap();
