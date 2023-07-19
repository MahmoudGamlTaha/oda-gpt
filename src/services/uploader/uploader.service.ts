import { Repository } from "typeorm";
import { BaseService } from "../base.service";
import { ImageUploader } from "src/model/uploader.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import multer from "multer";
import  {UploadApiErrorResponse, UploadApiResponse, v2} from "cloudinary"
import { resolve } from "path";
//import toStream = require('buffer-to-stream');
const streamifier = require('streamifier');


@Injectable()
export class UploaderService extends BaseService<ImageUploader, Repository<ImageUploader>>{

     constructor(@InjectRepository(ImageUploader) private readonly imageUploaderRepository:Repository<ImageUploader>){
        super(imageUploaderRepository);
        
     }
     async uploadFile(file:Express.Multer.File){
      return await this.CloudinaryUpload(file);
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

     }
}