import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CustomErrorFilter } from '../src/presentation/rest/custom.error.filter';
import { UserEntity } from '../src/infrastructure/postgres/user/user.entity';
import { FriendEntity } from '../src/infrastructure/postgres/friend/friend.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new CustomErrorFilter());
    await app.init();

    await FriendEntity.destroy({ where: {} });
    await UserEntity.destroy({ where: {} });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(
        'Welcome, please check out the API documentation at <a href="/api"/>/api</a>',
      );
  });
});
