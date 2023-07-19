import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { PromptGuide } from "src/model/PromptGuide.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class PromptGuidService extends BaseService<PromptGuide, Repository<PromptGuide>>{
   constructor(@InjectRepository(PromptGuide) private promptGuidRepository:Repository<PromptGuide>){
    super(promptGuidRepository);
   }
}