import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  async create(@UploadedFiles() files, @Body() data, @Res() response) {
    try {
      const { email, password, login } = data;
      const { picture } = files;

      const userData = await this.userService.registration(email, login, password, picture[0]);
      response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return userData;
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async registration() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async login() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async activate() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async refresh() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async logout() {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete(':id')
  getOneUser(@Param(':id') id: Types.ObjectId) {
    return this.userService.deleteUserById(id);
  }
}
