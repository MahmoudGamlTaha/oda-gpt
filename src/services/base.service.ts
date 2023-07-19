import { Get, Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSessionService } from "src/common/userSession.service";
import { BaseEntity } from "src/model/base.entity";
import { User } from "src/model/user.entity";
import {  Repository } from "typeorm";

@Injectable({scope: Scope.DEFAULT})
export abstract class BaseService<entity extends BaseEntity,repository extends Repository<entity>> {
    condition:any;
    relations:any;
    loadReleationId:boolean;
    @Inject(UserSessionService)
    userSessionService:UserSessionService;
   
    constructor(protected genaricRepo: repository ){
    };
    public toEntity(dto:any){};
    public toDto(){};
    public save(entity:entity):Promise<entity>{
        return this.genaricRepo.save(entity);
    }
    public saveAll(entities:entity[]){
      return this.genaricRepo.save(entities)
    }
    public  setRelation(){
      this.relations = {};
    }
    public setCriteria(){
      this.condition = {};
    }
    public setCondition(condition:any){
      this.condition = condition;
    }
    public async findAll() : Promise<entity[]>{
            this.setRelation();
            this.setCriteria();
       return  this.genaricRepo.find({where: this.condition, relations: this.relations, loadRelationIds:this.loadReleationId}); 
    };

    public getCurrentUser():Promise<User>{
       return this.userSessionService.getCurrentUser();
    }

} 