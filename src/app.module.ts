import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { LoggerModule } from 'nestjs-pino-logger';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo/test_backend'),
        LoggerModule.forRoot(),
        UsersModule
    ]
})
export class AppModule { }