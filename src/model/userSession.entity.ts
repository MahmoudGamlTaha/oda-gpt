import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({name:'user_session'})
export class UserSession extends BaseEntity{
    @Column({name:'token'})
    token:string;
    
    @Column({name: 'user_id'})
    userId:number;

    @Column({name:'start_at'})
    startAt:Date

    @Column({name:'end_at'})
    endAt:Date;

    @ManyToOne(type => User, user=> user.id)
    @JoinColumn({name:"user_id"})
    user:User;
}