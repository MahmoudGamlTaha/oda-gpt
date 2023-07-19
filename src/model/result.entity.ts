import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({name:"results"})
export class Result extends BaseEntity{

      @Column({name:"result"})
      result:string

      @Column({name:"result_type"})
      resultType:string
      
      @Column({name:"user_id"})
      userId:Number;

      @Column({name:"prompt_id"})  
      promptId:Number;

    

} 