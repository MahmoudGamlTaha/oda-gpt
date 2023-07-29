import { Injectable,  UnauthorizedException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from '../base.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { StatusCode, saltRounds } from 'src/constant/constant';
import { UserSessionService } from 'src/common/userSession.service';
import { RegisterDto } from 'src/model/dto/register.dto';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService extends BaseService<User,Repository<User>>{
  constructor(@InjectRepository(User) private readonly authRepository:Repository<User>,
              private jwtService:JwtService, private readonly userSession:UserSessionService){
                super(authRepository);
              //   this.salt = bcrypt.genSaltSync(saltRounds); // salt round 14 /should not chnage for ever
              }
  //salt:string;
async signIn(username:string, password:string) {
   console.log(bcrypt.hashSync(password, saltRounds));
   const user = await this.authRepository.findOne({where:{email:username, active: 1}});
   if(user == null)
      throw new UnauthorizedException();
        console.log(user.password);
      const checkPass = await bcrypt.compare( password, user.password)
        console.log(checkPass);       
      if (!checkPass) {
         throw new UnauthorizedException('Invalid credentials.');
       }
   const payload = {email:user.email, id: user.fistName +' '+user.lastName}
   this.userSession.setUserId(user.id) 
   let token = await this.jwtService.signAsync(payload);
   this.userSession.setToken("Bearer "+token);
   this.userSession.setUser(user);
   return{
    statusCode:StatusCode.SUCCESS,   
    token: token
   }
}
 async register(register:RegisterDto){
   const checkUser = await this.authRepository.findOne({where:{email:register.email}});
     console.log(checkUser);
   if(checkUser != null){
      throw new HttpException("email exist", StatusCode.ValidationError)
   }
      let user = new User();
      user.active = 1
      user.credit = 0;
      user.email = register.email;
      user.password = register.mobile;
      user.fistName = register.name;
      user.lastName = register.lastName;
      user.lastUpdatedDate = new Date();
   //   user.validMail = false;
     
      user.password = bcrypt.hashSync(register.password, saltRounds);
      this.save(user);
      register.password = '';
      return{
         statusCode:StatusCode.SUCCESS,   
         message: "userCreated",
         data:register
        }
 }

}

