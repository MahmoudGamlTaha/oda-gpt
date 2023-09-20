import { RoomDesignService } from "src/services/roomDesign/roomDesign.service";
import { BaseController } from "../base.controller";
import { Body, Controller, Post, UploadedFile, UseInterceptors,ParseFilePipeBuilder, UseGuards } from "@nestjs/common";
import { DesignFilter } from "src/model/dto/designFilter.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/services/auth/auth.guard";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller('room-design')
@UseGuards(AuthGuard)
export class RoomDesignController extends BaseController<RoomDesignService> {
    constructor(public  readonly roomDesingService:RoomDesignService){
        super(roomDesingService);
    }

    @Post('upload-room')
    @UseInterceptors(FileInterceptor('file' , {storage: diskStorage({
    destination: '../uploadedImages/rooms',
    filename:(req,file,cb)=>{
        let randomName = 'room_txt2img';
        return cb(null, `${randomName}${extname(file.originalname)}`)
    }
    })}
    /*,{dest:'./uploaded'}*/))
    async uploadRoomImage(@UploadedFile(new ParseFilePipeBuilder().addFileTypeValidator({
        fileType: 'jpg|jpeg|png|bmp'
    }).addMaxSizeValidator({
        maxSize:5000*1000,
        message:'image should less than 5 mega'
    })
    .build({fileIsRequired:true})) file:Express.Multer.File){
        console.log(file.size)
       return  this.roomDesingService.uploadRoomImage(file);
   }
   @Post('check')
   async generateRoomDesign (@Body() designFilter:DesignFilter){
    return  await this.roomDesingService.getAIDesignRoomV2(designFilter);

   }
}