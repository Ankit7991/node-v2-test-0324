import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    next();

    const end = performance.now();
    const timeTaken = end - start;
    console.log(
      `${req.method} ${req.url} ${res.statusCode} ${timeTaken.toFixed(2)} ms`,
    );
  }
}
