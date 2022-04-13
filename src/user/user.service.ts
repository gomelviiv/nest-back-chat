import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from './file/file.service';
import { FileType } from './file/file.constant';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {}

  //   async create(dto: CreateUserDto, picture): Promise<User> {
  //     const picturePath = this.fileService.createFile(FileType.PICTURE, picture);

  //     const user = await this.userModel.create({ ...dto, picture: picturePath });
  //     return user;
  //   }

  async registration(email, login, password, picture) {
    const picturePath = this.fileService.createFile(FileType.PICTURE, picture);

    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом  ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();

    const user = await this.userModel.create({
      email,
      login,
      password: hashPassword,
      activationLink,
      picture: picturePath,
    });
    await this.mailService.sendActionMail(email, activationLink);

    const userDto = new CreateUserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
      picture: picturePath,
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find();

    return users;
  }

  async getOneUser(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);

    return user;
  }

  async deleteUserById(id: Types.ObjectId): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    return deletedUser._id;
  }
}
