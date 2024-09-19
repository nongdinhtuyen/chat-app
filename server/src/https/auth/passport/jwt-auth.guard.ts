import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { IS_PUBLIC_KEY } from 'src/decorator';
import { PermissionsService } from 'src/https/permissions/permissions.service';
import { RolesEnum } from 'src/https/roles/roles.enum';
import { RolesService } from 'src/https/roles/roles.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private rolesService: RolesService,
  ) {
    super({});
  }
  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const canActivate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user.role === RolesEnum.Admin) {
      return true;
    }
    const permissions = (await this.rolesService.findByName(user.role))
      .permissions;
    const targetMethod = request.method;
    const targetEndpoint = request.route.path;
    //check permissions

    const isExist = permissions.some(
      (permission) =>
        targetMethod === permission.method &&
        targetEndpoint === permission.path,
    );
    if (!isExist) {
      throw new ForbiddenException(
        'Bạn không có quyền để truy cập endpoint này!',
      );
    }
    return canActivate;
  }

  handleRequest(err, user, info, ctx: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      console.log('🚀 ~ JwtAuthGuard ~ handleRequest ~ err:', err || !user);
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
