import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useLogger } from './util/logger';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setGlobalApplicationContext } from './util/deps';

// @TODO action 1: Should use config form file and NODE_ENV to switch.
// @TODO action 2: Should generate api client from the generated swagger JSON Schema with swagger cli and code template.
async function bootstrap() {
  const logger = useLogger('System');
  const app = await NestFactory.create(AppModule, { logger: logger });

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
