import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    // 🛡️ Si l'utilisateur est admin, il a accès à tout
    if (user?.role === 'ADMIN') return true;

    // Sinon on applique la restriction classique
    if (!requiredRoles) return true;

    return requiredRoles.includes(user?.role);
  }
}
