import { Injectable,  UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from '../base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { StatusCode } from 'src/constant/constant';
import { UserSessionService } from 'src/common/userSession.service';
@Injectable()
export class AuthService extends BaseService<User,Repository<User>>{
  constructor(@InjectRepository(User) private readonly authRepository:Repository<User>,
              private jwtService:JwtService, private readonly userSession:UserSessionService){
                super(authRepository);
              }

async signIn(username:string, password:string) {
   const user = await this.authRepository.findOne({where:{email:username,password:password}});
   if(user == null)
      throw new UnauthorizedException();
   const payload = {email:user.email, id: user.fistName +' '+user.lastNname}
   this.userSession.setUserId(user.id) 
   let token = await this.jwtService.signAsync(payload);
   this.userSession.setToken("Bearer "+token);
   this.userSession.setUser(user);
   return{
    statusCode:StatusCode.SUCCESS,   
    token: token
   }
}

}

