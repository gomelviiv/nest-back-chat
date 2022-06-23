import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserByToken(token: string) {
    const candidate = await this.userModel.findOne({ activationLink: token });
    if (!candidate) {
      throw new BadRequestException('Ссылка не рабочая!');
    }
    return candidate;
  }

  async activateUser(token: string) {
    await this.userModel.findOneAndUpdate({ activationLink: token }, { isActivated: true });
  }

  async getUser(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);

    return user;
  }

  async getAllUsers(): Promise<any> {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  async updateUser(id: Types.ObjectId, ...args) {
    // const user = await this.userModel.findById(id);
    // const updatedUser = {
    //   ...user,
    //   ...args,
    // };
    // await this.userModel.save();
    // return;
  }

  async deleteUserById(id: Types.ObjectId): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    return deletedUser._id;
  }
}
