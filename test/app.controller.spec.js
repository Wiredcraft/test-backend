import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let app;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
