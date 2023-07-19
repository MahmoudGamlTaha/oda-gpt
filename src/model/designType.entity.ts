import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({name:'design_type'})
export class DesignType extends BaseEntity{
     
      @Column({name:'name'})
      name:string;

      @Column({name:'parent_id'})
      parentId:number;
} 