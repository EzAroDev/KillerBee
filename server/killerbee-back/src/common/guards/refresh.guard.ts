import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const refreshToken = req.headers['authorization']?.replace('Bearer ', '');
    req.refreshToken = refreshToken;
    return req;
  }
}
