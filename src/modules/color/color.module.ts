import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ColorController } from "src/controllers/color/color.controller";
import { Color } from "src/model/color.entity";
import { ColorService } from "src/services/color/color.service";


@Module({
imports:[TypeOrmModule.forFeature([Color])],
controllers:[ColorController],
providers:[ColorService],
exports:[ColorService]
})

export class ColorModule{}