import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { PromptGuide } from "src/model/PromptGuide.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { randomInt } from "crypto";
import { ColorService } from "../color/color.service";
import { ModuleRef } from "@nestjs/core";
import { Color } from "src/model/color.entity";

@Injectable()
export class PromptGuidService extends BaseService<PromptGuide, Repository<PromptGuide>>{
    colorService:ColorService;
      
   constructor(@InjectRepository(PromptGuide) private promptGuidRepository:Repository<PromptGuide>){
    super(promptGuidRepository);
   }
   async init(){
      this.colorService = this.moduleRef.get(ColorService, { strict: false });
   }
   public findByDesignTypeId(designTypeId:number){
   }
   public async findByTags(tag:any):Promise<String>{
      const colors = ["Red", "Blue", "yellow", "maroon", "white", "black", "green", "purple"];
      console.log("color length"+ colors.length);
      let color = colors[this.generateRandom(colors.length)];
      let condition = {};
      if(tag["style"]){
         condition["designTypeId"] = tag["style"];     
      }
      if(tag["color"]) {
         if(typeof tag["color"] == 'number'){
            console.log(typeof tag["color"]);
            const colorEntity = await this.colorService.findOneById(tag["color"]);
            if(colorEntity != null){
            color = colorEntity.name;
            }
         }
      } 
      this.setCondition(condition);
      const promptGuidRes = await this.find();
      let prompt:String = "";
      if(promptGuidRes != null){
         prompt = promptGuidRes[0].prompt;
        prompt = prompt.replace("$color", color);
      }
      return prompt;
   }
   public findByDesignIdAndTag(designTypeId:number, tag:String ){
    
   }
   private generateRandom(maxLimit = 7, min = 0){
      let rand = Math.random() * maxLimit;
      // const seed = Date.now();
 // Math.seedrandom(seed.toString());
      rand = Math.floor(Math.random() * (maxLimit - min + 1)) + min; // 99
      return rand;
    }
}