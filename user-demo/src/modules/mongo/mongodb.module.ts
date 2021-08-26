import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    //TODO: use  @nest/config
    imports: [MongooseModule.forRoot('mongodb://localhost:27017/nest')]
})

export class MongodbModoule {
    
}