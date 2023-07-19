
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';
export abstract class BaseEntity{
  @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id:number;
  @Column({name:'last_updated_date'})
  lastUpdatedDate:Date;
  
}