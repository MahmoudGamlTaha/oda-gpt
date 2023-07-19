import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity({name:'colors'})
export class Color extends BaseEntity{
   @Column({name:"name"})
    name:string;
}