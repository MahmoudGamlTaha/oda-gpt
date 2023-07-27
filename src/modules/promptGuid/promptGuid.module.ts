import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PromptGuide } from "src/model/PromptGuide.entity";
import { PromptGuidService } from "src/services/promptGuide/promptGuid.service";

@Module({
imports:[TypeOrmModule.forFeature([PromptGuide])],
providers:[PromptGuidService],
exports:[PromptGuidService]    
})
export class PromptGuidModule{

} 