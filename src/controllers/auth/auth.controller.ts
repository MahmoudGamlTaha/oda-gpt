import { Controller } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Body, HttpCode, Post } from '@nestjs/common/decorators';
import { loginDto } from 'src/model/dto/login.dto';
import { BaseController } from '../base.controller';
import { AuthService } from 'src/services/auth/auth.service';
@Controller('auth')
export class AuthController extends BaseController<AuthService>{

    constructor(private authService:AuthService){
        super(authService);
    }
    @HttpCode(HttpStatus.OK)  
    @Post('login')
    signIn(@Body() login:loginDto){
       return this.authService.signIn(login.email, login.password);  
  }
}
