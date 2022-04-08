import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path'

import { FileModule } from './user/file/file.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb+srv://admin:admin@cluster0.bbyee.mongodb.net/Chat?retryWrites=true&w=majority'),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
          }),
        UserModule,
        FileModule,
    ]
})
export class AppModule {}
