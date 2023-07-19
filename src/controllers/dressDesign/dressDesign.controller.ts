import { BaseController } from "../base.controller";
import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { DesignFilter } from "src/model/dto/designFilter.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { DressDesignService } from "src/services/dressDesign/dressDesign.service";
import { ResultService } from "src/services/result/result.service";
import { AuthGuard } from "src/services/auth/auth.guard";

@Controller('dress-design')
@UseGuards(AuthGuard)
export class DressDesignController extends BaseController<DressDesignService> {
    constructor(private  readonly dressDesignService:DressDesignService){
        super(dressDesignService);
    }

    @Post('upload-dress')
    @UseInterceptors(FileInterceptor('file'  /*,{dest:'./uploaded'}*/))
    async uploadRoomImage(@UploadedFile() file:Express.Multer.File){
       return  this.dressDesignService.uploadDressImage(file);
   }
   @Post('check')
   async generateRoomDesign (@Body() designFilter:DesignFilter){
    return  await this.dressDesignService.getAIDesignDressReplicateV2(designFilter);

   }
}