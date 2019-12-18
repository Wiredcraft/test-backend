import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaModule } from './service/schema.module';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test-backend', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  }),
    SchemaModule],
})

export class AppModule { }
