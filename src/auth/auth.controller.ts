import { Body, Controller, Get, Param, Post, Redirect, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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

  @Redirect(`${process.env.API_APP}`, 301)
  @Get('activate/:link')
  async activateUser(@Param('link') token) {
    console.log(process.env.API_APP);
    return await this.authService.updateActivateUserLink(token);
  }
}
