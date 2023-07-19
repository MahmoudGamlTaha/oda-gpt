import {  Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({name:'uploaded_images'})
export class ImageUploader extends BaseEntity{
   @Column({name:'img_url'})
     imageUrl:string;

     @Column({name:'user_id'})
     userId:Number;

     @Column({name:'design_type_id'})
      designTypeId:Number;

     @Column({name:'prompt_id'})
      promptId:Number;
}
