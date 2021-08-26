import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MongodbModoule } from './modules/mongo/mongodb.module';

@Module({
  imports: [ MongodbModoule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
