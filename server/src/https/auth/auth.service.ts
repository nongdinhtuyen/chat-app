import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import utils from 'src/common/utils';
import { response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUserName(username).lean();
    if (user && utils.isCorrectPassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private generateAccessToken(user: IUser) {
    const payload = {
      _id: user._id,
      name: user.username,
      role: user.role,
      image: user.image,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
    });
  }
  private generateRefreshToken(user: IUser) {
    const payload = {
      _id: user._id,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
    });
  }

  async signIn(user: IUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);
    await this.usersService.update(user._id, { refreshToken });
    return {
      accessToken,
      refreshToken,
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService
      .findByUserName(createUserDto.username)
      .lean();
    if (user) throw new BadRequestException('User already exists');
    const hashPassword = utils.getHashPassword(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });
    return;
  }

  async logout(user: IUser) {
    const result = await this.usersService.update(user._id, {
      refreshToken: null,
    });
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const decodeToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
      });
      const user: IUser = (
        await this.usersService.findOne(decodeToken._id)
      ).toObject();
      const accessToken = this.generateAccessToken(user);
      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh Token expired');
    }
  }
}
