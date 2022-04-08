import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { Types } from 'mongoose'
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller('/users')

export class UserController {

    constructor(private userService: UserService){}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{name: 'picture', maxCount: 1}]))
    create(@UploadedFiles() files, @Body() dto: CreateUserDto){
        const {picture} = files
        return this.userService.create(dto, picture[0])
    }

    @Get()
    getAllUsers(){
        return this.userService.getAllUsers()
    }

    @Delete(':id')
    getOneUser(@Param(':id') id: Types.ObjectId){
        return this.userService.deleteUserById(id)
    }
}