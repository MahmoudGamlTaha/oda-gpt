import { Get, Inject, Injectable, OnModuleInit, Scope } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSessionService } from "src/common/userSession.service";
import { BaseEntity } from "src/model/base.entity";
import { User } from "src/model/user.entity";
import {  Entity, Equal, Repository } from "typeorm";

@Injectable({scope: Scope.DEFAULT})
export abstract class BaseService<entity extends BaseEntity,repository extends Repository<entity>>  implements OnModuleInit {
    condition:any;
    relations:any;
    loadReleationId:boolean;
    // @Inject(UserSessionService)  // case exception
    userSessionService:UserSessionService;
    //https://docs.nestjs.com/fundamentals/module-ref
    @Inject(ModuleRef)
    protected moduleRef: ModuleRef;
   async onModuleInit() {
    //o retrieve a provider from the global context (for example, if the provider has been injected in a different module), pass the { strict: false } option as a second argument to get().
      this.userSessionService = this.moduleRef.get(UserSessionService, { strict: false });
      await this.init();
      // await this.moduleRef.resolve(UserSessionService);
      //this.moduleRef.get(UserSessionService);
     // console.log(`The module has been initialized.`); // init base every class
    }
    constructor(protected genaricRepo: repository ){
    };
     protected async init(){};
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
    public setCustomRelation(relation:any){
      this.relations = relation;
    }
    public async findAll() : Promise<entity[]>{
            this.setRelation();
            this.setCriteria();
       return  this.genaricRepo.find({where: this.condition, relations: this.relations, loadRelationIds:this.loadReleationId}); 
    }

    public async find() : Promise<entity[]>{
     return  this.genaricRepo.find({where: this.condition, relations: this.relations, loadRelationIds:this.loadReleationId}); 
   }
   public async findOneById(entityId:number): Promise<entity>{
     this.setCondition({id : entityId});
     const entity =  await this.find();
     return entity != null ? entity[0]: null; 
   }
     

    public getCurrentUser():Promise<User>{
       return this.userSessionService.getCurrentUser();
    }

} 