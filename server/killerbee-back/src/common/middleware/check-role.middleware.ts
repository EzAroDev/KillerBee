import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const role = req.headers['x-role'] as string;

    if (!role || !['RD', 'PROD', 'TEST', 'USER'].includes(role.toUpperCase())) {
      throw new ForbiddenException('Rôle non autorisé');
    }

    req['role'] = role.toUpperCase();
    next();
  }
}
