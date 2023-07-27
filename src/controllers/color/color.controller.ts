
import { ColorService } from "src/services/color/color.service";
import { BaseController } from "../base.controller";
import { Controller } from "@nestjs/common";

@Controller('color')
export class ColorController extends BaseController<ColorService>{
    constructor(private readonly colorService:ColorService){
        super(colorService);
    }

}