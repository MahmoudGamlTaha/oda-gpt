import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { DesignType } from "./designType.entity";
import { type } from "os";


@Entity({name:'prompt_guide'})
export class PromptGuide extends BaseEntity{

    @Column({name:'prompt'})
    public prompt:string;

    @Column({name :'design_type_id'})
     designTypeId:number;
    
     @ManyToOne(type=>DesignType, desginType=>desginType.id)
     @JoinColumn({name:'design_type_id'})
     desginType:DesignType;

     @Column({name:'tag'})
     tag:string;

}