import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { ImageUploader } from "src/model/uploader.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, UploadedFile, UseInterceptors } from "@nestjs/common";
import  {UploadApiErrorResponse, UploadApiResponse, v2} from "cloudinary"
import { resolve } from "path";
const fs = require("fs");
//import toStream = require('buffer-to-stream');
const streamifier = require('streamifier');


@Injectable()
export class UploaderService extends BaseService<ImageUploader, Repository<ImageUploader>>{

     constructor(@InjectRepository(ImageUploader) private readonly imageUploaderRepository:Repository<ImageUploader>){
        super(imageUploaderRepository);
        
     }
     async uploadFile(file:Express.Multer.File){
      return await this.ServerUpload(file);
     }
     private  CloudinaryUpload(file:Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse>{

      return  new Promise((resolve, reject) => {
         const upload = v2.uploader.upload_stream((error, result) => {
           if (error) return reject(error);
           resolve(result);
         });
       //  toStream(file.buffer).pipe(upload);
       streamifier.createReadStream(file.buffer).pipe(upload);
  });
  
 }    
     private async ServerUpload(file:Express.Multer.File){
       let uid = (await this.getCurrentUser()).id;
       let max = await this.getMaxUploadByUid(uid);
      let uploadPath = `../uploadedImages/rooms/room_txt2img_${uid}_${max}.png`;
       fs.writeFileSync(uploadPath, file.buffer);

     }

     private async getMaxUploadByUid(uid:Number){
        let queryBuilder = this.imageUploaderRepository.createQueryBuilder('uploader');
            queryBuilder.select("COALESCE(Max(uploader.id),0) + 1",'maxId').where(`uploader.userId =:uid`,{uid}).addGroupBy("uploader.userId") ;
            const result =  await queryBuilder.getRawOne();
  
                return result.maxId == null? 1 : result.maxId;
     }
}