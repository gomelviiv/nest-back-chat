import { Body, Controller, Get, Param, Post, Redirect, Req, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async registration(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data,
    @Res({ passthrough: true }) response,
  ) {
    return await this.authService.registration(data, files, response);
  }

  @Get('activate/:link')
  async activateUser(@Param('link') token, @Res({ passthrough: true }) response) {
    await this.authService.updateActivateUserLink(token);
    return response.redirect(process.env.API_APP);
  }

  @Post('/login')
  @FormDataRequest()
  async login(@Body() data, @Res({ passthrough: true }) response) {
    return await this.authService.login(data, response);
  }

  @Post('/logout')
  async logout(@Req() request, @Res({ passthrough: true }) response) {
    return await this.authService.logout(request, response);
  }

  @Get('/refresh')
  async refresh(@Req() request, @Res({ passthrough: true }) response) {
    return await this.authService.refreshToken(request, response);
  }
}
