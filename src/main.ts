import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { existsSync, readFileSync } from 'fs';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

const CONTEXT = 'Main';
const CERT_FILE = 'localhost.pem';
const KEY_FILE = 'localhost-key.pem';

function createApp(): Promise<INestApplication> {
  let httpsOptions: HttpsOptions = {};
  if (existsSync(`./${KEY_FILE}`) && existsSync(`./${CERT_FILE}`)) {
    Logger.log('Certificate found, use HTTPS to serve app', CONTEXT);
    httpsOptions = {
      key: readFileSync(`./${KEY_FILE}`),
      cert: readFileSync(`./${CERT_FILE}`),
    };
  } else if (process.env.NODE_ENV === 'development') {
    Logger.log(
      `Certificate files not found. Put ${KEY_FILE} and ${CERT_FILE} in the project root to use HTTPS.`,
      CONTEXT,
    );
  }

  return NestFactory.create(AppModule, {
    httpsOptions,
  });
}

function setUpOpenApi(app: INestApplication) {
  Logger.log('Setting up OpenApi document...', CONTEXT);
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
  Logger.log('OpenApi document set-up finished.', CONTEXT);
}

async function bootstrap() {
  Logger.log('Bootstrapping app...', CONTEXT);
  const app = await createApp();
  setUpOpenApi(app);
  app.useGlobalPipes(new ValidationPipe());

  const PORT = 3000;
  await app.listen(PORT);
  Logger.log(`Bootstrap finished. Connect to the port ${PORT}.`, CONTEXT);
}
bootstrap();
