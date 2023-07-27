import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserSessionService } from 'src/common/userSession.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userSessionService:UserSessionService){

    }
    
  use(req: Request, res: Response, next: NextFunction) {
    console.log('AuthMiddleware');
   // console.log(req.headers.authorization);
    this.userSessionService.setToken(req.headers.authorization);
  // console.log(this.userSessionService.getCurrentUser());
    next();
  }
}
