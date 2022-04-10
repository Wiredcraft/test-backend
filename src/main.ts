import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useLogger } from './util/logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setGlobalApplicationContext } from './util/deps';

async function bootstrap() {
  const logger = useLogger('System');
  const app = await NestFactory.create(AppModule, { logger: logger });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API DOCUMENT')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  setGlobalApplicationContext(app)
  logger.log('listen to port 3000');
}
bootstrap();
