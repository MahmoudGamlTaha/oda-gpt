import { DesignTypeService } from "src/services/designType/designType.service";
import { BaseController } from "../base.controller";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('design-type')
export class DesignTypeController extends BaseController<DesignTypeService>{
    constructor(private designTypeService:DesignTypeService){
        super(designTypeService);
    }

    @Get('find-by-cat/:catId')
    async findByCategory(@Param('catId') cat:Number){
        let types = this.designTypeService.findByCategory(cat);
        return types;        
    }
}