import { Body, Controller, HttpCode, HttpStatus, Post, Get } from '@nestjs/common';
import { loginDto } from 'src/model/dto/login.dto';
import { AuthGuard } from 'src/services/auth/auth.guard';
import { UserService } from 'src/services/users/user.service';
import { UseGuards } from '@nestjs/common/decorators';
import { BaseController } from '../base.controller';
// refrence page
//https://docs.nestjs.com/security/authentication
//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController extends BaseController<UserService>{
  constructor(private userService:UserService){
    super(userService);
}
  
  @Get('/')
    public findAll(){
       return this.userService.findAll();
    }

}
