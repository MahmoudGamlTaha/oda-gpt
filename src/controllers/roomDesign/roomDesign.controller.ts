import { RoomDesignService } from "src/services/roomDesign/roomDesign.service";
import { BaseController } from "../base.controller";
import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { DesignFilter } from "src/model/dto/designFilter.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('room-design')
export class RoomDesignController extends BaseController<RoomDesignService> {
    constructor(public  readonly roomDesingService:RoomDesignService){
        super(roomDesingService);
    }

    @Post('upload-room')
    @UseInterceptors(FileInterceptor('file'  /*,{dest:'./uploaded'}*/))
    async uploadRoomImage(@UploadedFile() file:Express.Multer.File){
       return  this.roomDesingService.uploadRoomImage(file);
   }
   @Post('check')
   async generateRoomDesign (@Body() designFilter:DesignFilter){
    return  await this.roomDesingService.getAIDesignRoomV2(designFilter);

   }
}