import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const now = Date.now();

    res.on('finish', () => {
      const responseTime = Date.now() - now;
      const statusCode = res.statusCode;

      console.log(
        `[${method}] ${originalUrl} - ${statusCode} - ${responseTime}ms - ${userAgent}`,
      );
    });

    next();
  }
}
