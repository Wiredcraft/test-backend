import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ErrorCatchFilter } from './ErrorCatchFilter';
import { ResponseInterceptor } from './ResponseInterceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Test Backend Api Doc')
    .setDescription('API  文档')
    .setVersion('1.0.1')
    .build();

  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorCatchFilter());
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
}
bootstrap();
