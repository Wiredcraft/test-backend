import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsModule } from './follows/follows.module';
import { UserModule } from './user/user.module';
import { PassportModule } from './common/passport/passport.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test-backend', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }),
    PassportModule,
    UserModule,
    FollowsModule],
})

export class AppModule { }
