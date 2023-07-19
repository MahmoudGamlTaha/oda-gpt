//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f

import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../base.service";
import { User } from "src/model/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService extends BaseService<User, Repository<User>>{
     
    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){
       super(userRepository);
    }

    public async findOne(username:string, password:string) : Promise<User|undefined>{
        const user = await this.userRepository.findOne({where: 
            {
             email:username,
             password:password,
            }});
            if(user == null)
             throw new NotFoundException();
        return user;
    }
    public async findById(id:number): Promise<User>{
        return await this.userRepository.findOneBy({id:id});
    }


}
