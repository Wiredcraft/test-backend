import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(configuration.port);
}
bootstrap();
