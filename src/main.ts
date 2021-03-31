import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

const CONTEXT = 'Main';

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
  const app = await NestFactory.create(AppModule);
  setUpOpenApi(app);
  app.useGlobalPipes(new ValidationPipe());

  const PORT = 3000;
  await app.listen(PORT);
  Logger.log(`Bootstrap finished. Connect to the port ${PORT}.`, CONTEXT);
}
bootstrap();
