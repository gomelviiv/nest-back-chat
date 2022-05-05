import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/token/token.service';
import { FileService } from 'src/file/file.service';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { FileType } from 'src/file/file.constant';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService,
    private mailService: MailService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}

  async registration(data, files, response) {
    const { email, password, login } = data;

    const { picture } = files;
    const picturePath = this.fileService.createFile(FileType.PICTURE, picture[0]);

    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new Error(`Пользователь с почтовым адресом  ${email} уже существует`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();

    const user = await this.userModel.create({
      login,
      email,
      password: hashPassword,
      activationLink,
      picture: picturePath,
    });
    await this.mailService.sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationLink}`);

    const userDto = new CreateUserDto(user);
    const tokens = this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    const userData = {
      ...tokens,
      user: userDto,
      isAuthenticated: true,
    };

    response.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

    return userData;
  }

  async updateActivateUserLink(token) {
    await this.userService.activateUser(token);
    return true;
  }
}
