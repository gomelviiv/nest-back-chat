import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose'

import { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { FileService } from "./file/file.service";
import { FileType } from "./file/file.constant";

@Injectable()

export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
        private fileService: FileService
    ){}
    
    async create(dto: CreateUserDto, picture): Promise<User> {
        const picturePath = this.fileService.createFile(FileType.PICTURE, picture)

        const user = await this.userModel.create({...dto, picture: picturePath} )
        return user
    }

    async getAllUsers(): Promise<User[]>{
        const users = await this.userModel.find()
        
        return users
    }

    async getOneUser(id: Types.ObjectId): Promise<User>{
        const user = await this.userModel.findById(id)
        
        return user 
    }

    async deleteUserById(id: Types.ObjectId): Promise<User>{
        const deletedUser = await this.userModel.findByIdAndDelete(id)
        
        return deletedUser._id
    }
}