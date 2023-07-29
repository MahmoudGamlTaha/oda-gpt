

import { BaseEntity } from "./base.entity";
import { Entity, Column } from 'typeorm';

@Entity({name: "users"})
export class User extends BaseEntity{

  @Column({name:'f_name', type:'varchar', length:250})  
  fistName:string;
  
  @Column({name:'l_name', length:250})
  lastName:String;

  @Column({name:'email', type:'varchar' , length:255, unique:true})
  email: string;

  @Column({name:'active'})
  active:number;
  
  @Column({name:'credit'})
  credit:number;

  @Column({name:'password'})
  password:string;

 // @Column({name:'valid_mail'})
  //validMail:Boolean;
}