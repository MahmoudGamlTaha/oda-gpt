import { Inject, Injectable, OnModuleInit, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/model/user.entity";
import { UserSession } from "src/model/userSession.entity";
import { BaseService } from "src/services/base.service";
import { UserService } from "src/services/users/user.service";
import { MoreThanOrEqual, Repository } from "typeorm";
@Injectable()
export class UserSessionService  {
    private token:string;
    private userId:number;
    private user:User;
    //@Inject(forwardRef(()=>UserService))
   // private readonly userService:UserService;
    constructor(@InjectRepository(UserSession) private readonly userSessionRepository:Repository<UserSession>){
      //   super(userSessionRepository);
    }
    public async getCurrentUser():Promise<User>{
       // if(this.userId != null){
      //    return  await this.userService.findById(this.userId);
         if(this.token != null){
            const session = await this.userSessionRepository.find({where:{token: this.token,endAt:MoreThanOrEqual(new Date())}, relations:["user"]});
           console.log(session);
            return session[0]!=null?session[0].user:null;
        }
        return null;
    }
    public setToken(token:string){
        this.token = token;
    }
    public setUserId(userId:number){
        this.userId = userId;
    }

    public setUser(user:User){
        this.user = user;
        if(user != null){
          this.setUserId(user.id);
          this.saveUserSession();
        }
    }
    public saveUserSession(){
        let userSession = new UserSession();
          userSession.userId = this.userId;
          var date = new Date();
            date.setDate(date.getDate() + 5);
            userSession.startAt = new Date();
            userSession.endAt = date;
            userSession.token = this.token;
            this.userSessionRepository.delete({userId:this.userId});
            this.userSessionRepository.save(userSession);
    }
    
    
}