import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { Token, TokenSchema } from './schemas/token.schema';
import { TokenService } from './token.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]), ConfigModule.forRoot()],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
