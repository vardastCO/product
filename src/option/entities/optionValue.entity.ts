// src/options/option.entity.ts
import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Option } from "./option.entity";
import { AttribuiteValues } from "src/attribuite-value/entities/value-service.entity";
import { Products } from "src/product/entities/product.entity";

@ObjectType()
@Entity("option_value")
@Index(["productId", "valueId"], { unique: true }) 
export class OptionValue extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Option)
  @ManyToOne(() => Option)
  option: Promise<Option>;
  @Index()
  @JoinColumn({ name: 'optionId' })
  @Column()
  optionId: number;
  
    
  @Field(() => AttribuiteValues)
  @ManyToOne(() => AttribuiteValues)
  value: Promise<AttribuiteValues>;
  @Index()
  @Column()
  valueId: number;

  @Field(() => Products)
  @ManyToOne(() => Products)
  product: Promise<Products>;
  @Index()
  @Column()
  productId: number;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @Column({ nullable: true })
  deletedAt: string; 
    

}
