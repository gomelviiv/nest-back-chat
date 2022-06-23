import { HttpStatus, Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new UnauthorizedException('UnauthorizedException', '401');
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException('UnauthorizedException', '401');
      }

      const userData = this.tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw new UnauthorizedException('UnauthorizedException', '401');
      }
      console.log(userData);
      req.body = userData;
      next();
    } catch (error) {
      throw new UnauthorizedException('UnauthorizedException', '401');
    }
  }
}
