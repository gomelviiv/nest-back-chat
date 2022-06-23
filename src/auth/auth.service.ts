import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
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

  async login(data, response) {
    const { login, password } = data;
    console.log(login, password);
    const user = await this.userModel.findOne({ login });

    if (!user) {
      throw new Error(`Юзер с таким логином не найден`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);

    if (!isPassEquals) {
      throw new Error(`Не верный пароль`);
    }

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

  async logout(request, response) {
    const { refreshToken } = request.cookies;
    const token = await this.tokenService.removeToken(refreshToken);
    response.cookie('refreshToken');
    console.log(token);
    return token;
  }

  async refreshToken(request, response) {
    try {
      const { refreshToken } = request.cookies;
      if (!refreshToken) {
        throw new UnauthorizedException('UnauthorizedException', '401');
      }

      const userData = await this.tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await this.tokenService.findToken(refreshToken);

      if (!userData || !tokenFromDb) {
        throw new UnauthorizedException('UnauthorizedException', '401');
      }

      const user = await this.userModel.findById(userData.id);
      const userDto = new CreateUserDto(user);
      const tokens = this.tokenService.generateTokens({ ...userDto });
      await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

      const newUserData = {
        ...tokens,
        user: userDto,
        isAuthenticated: true,
      };

      response.cookie('refreshToken', newUserData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return newUserData;
    } catch (error) {
      throw new ForbiddenException('UnauthorizedException', '401');
    }
  }
}
