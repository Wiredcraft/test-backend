import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
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
  await app.listen(3000);
}
bootstrap();
