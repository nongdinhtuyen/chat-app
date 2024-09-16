import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Response,
  UseGuards,
  Req,
  Logger,
  Res,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public, ResponseMessage, Roles } from 'src/decorator';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: SignInDto })
  login(@CurrentUser() user) {
    return this.authService.signIn(user);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  logout(@CurrentUser() user) {
    return this.authService.logout(user);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign Up' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ResponseMessage('Success')
  createUser(@Body() createAuthDto: SignUpDto) {
    return this.authService.signUp(createAuthDto);
  }

  @Public()
  @ApiOperation({ summary: 'Refresh Token' })
  @Post('refresh-token')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
