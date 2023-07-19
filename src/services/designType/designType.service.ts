import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { DesignType } from "src/model/designType.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class DesignTypeService extends BaseService<DesignType,Repository<DesignType>>{
    constructor(@InjectRepository(DesignType) private readonly designTypeRepository:Repository<DesignType> ){
        super(designTypeRepository);
    }
    async findByCategory(cat:Number): Promise<DesignType[] | []>{
      const list = await this.designTypeRepository.find({where :{parentId:Number(cat)}});
      return list;
    }     

}