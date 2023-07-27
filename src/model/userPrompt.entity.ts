import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DesignType } from "./designType.entity";
import { type } from "os";


@Entity({name:'user_prompt'})
export class UserPrompt extends BaseEntity{

    @Column({name:'user_prompt'})
    public prompt:String;
    
     @Column({name:'user_id'})
      userId:number;

     @Column({name :'design_type_id'})
      designTypeId:number;

      @ManyToOne(type=>DesignType, desginType=>desginType.id)
      @JoinColumn({name:'design_type_id'})
      desginType:DesignType;

}