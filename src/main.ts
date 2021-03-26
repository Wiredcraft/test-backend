import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { existsSync, readFileSync } from 'fs';

const CERT_FILE = 'localhost.pem';
const KEY_FILE = 'localhost-key.pem';

async function bootstrap() {
  let httpsOptions = {};
  if (existsSync(`./${KEY_FILE}`) && existsSync(`./${CERT_FILE}`)) {
    httpsOptions = {
      key: readFileSync(`./${KEY_FILE}`),
      cert: readFileSync(`./${CERT_FILE}`),
    };
  } else if (process.env.NODE_ENV === 'development') {
    Logger.log(
      `Certificate files not found. Put ${KEY_FILE} and ${CERT_FILE} in the project root to use HTTPS.`,
    );
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const config = new DocumentBuilder()
    .setTitle('Wiredcraft Back-end Developer Test')
    .setDescription(
      'a RESTful API that can get/create/update/delete user data from a persistence database',
    )
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
