import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const optionsApp = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('test-backend')
  .setDescription('The test-backend API description')
  .setVersion('1.0')
  .setBasePath('api/v1')
  .build();

  const documentApp = SwaggerModule.createDocument(app, optionsApp);
  SwaggerModule.setup('api', app, documentApp);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(passport.initialize());

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
bootstrap();
