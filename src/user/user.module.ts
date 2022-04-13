import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';

import { TokenModule } from 'src/token/token.module';
import { FileModule } from './file/file.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), FileModule, MailModule, TokenModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
