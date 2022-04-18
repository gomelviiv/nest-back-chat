import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'picture', maxCount: 1 }]))
  registration(@UploadedFiles() files, @Body() data, @Res({ passthrough: true }) response) {
    try {
      return this.userService.registration(data, files, response);
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
