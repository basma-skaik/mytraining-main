import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { jwtConstants } from 'src/auth/constants';
import { CustomLogger } from '../loggers/winston.logger';
import { UsersService } from 'src/modules/users/users.service';
import { RolesGuard } from './roles.guard';
import { CheckItemExistance } from '../utils';

// TODO: guards should be put in common folder //Done
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, 
    private readonly reflector: Reflector,
    private usersService: UsersService) {}

    private readonly logger = new CustomLogger();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      // If the route is marked as public (unprotected), allow access without authentication.
      this.logger.log('Public route - Access allowed without authentication')
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // TODO: no bearer token, return only the token //Done
    const token = request.headers.authorization;
    if (!token) {
      this.logger.error('Unauthorized: Token not found in request header')
      throw new HttpException('Unauthorized: Token not found in request header', HttpStatus.FORBIDDEN);
    }

    const payload = await this.jwtService.verify(token,{ secret: jwtConstants.secret})

    CheckItemExistance(payload, 'Payload not found!')

    const user = await this.usersService.findOne(payload.id)

    CheckItemExistance(user, 'user not found!')

    request.user = user.get({ plain: true });

    const roleGuard = new RolesGuard(this.reflector);

    return roleGuard.canActivate(context);
  }
}