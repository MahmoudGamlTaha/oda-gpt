import { Get } from "@nestjs/common";
import { BaseEntity } from "src/model/base.entity";
import { BaseService } from "src/services/base.service";
import { Repository } from "typeorm";


export class BaseController<service extends BaseService<any,any>>{
   constructor(public service:service){
    
   }
   @Get('/')
    public async findAll() : Promise<any[]>{
      return this.service.findAll();
    }

}