import { Color } from "src/model/color.entity";
import { BaseService } from "../base.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ColorService extends BaseService<Color, Repository<Color>> {
  constructor(@InjectRepository(Color) private readonly colorRepository:Repository<Color>){
           super(colorRepository);
  }
}