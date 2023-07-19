import { Result } from "src/model/result.entity";
import { BaseService } from "../base.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
@Injectable()
export class ResultService extends BaseService<Result,Repository<Result>>{
     constructor(@InjectRepository(Result)private readonly resultRepository:Repository<Result>){
        super(resultRepository);
     }
     async getMaxId() {
        const query = this.resultRepository.createQueryBuilder("result");
        query.select("MAX(result.id) + 1", "max");
        const result = await query.getRawOne();
        return result.max;
      }
}