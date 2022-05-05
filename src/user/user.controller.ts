import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Delete(':id')
  getOneUser(@Param(':id') id: Types.ObjectId) {
    return this.userService.deleteUserById(id);
  }
}
