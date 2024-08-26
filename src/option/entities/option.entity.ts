// src/options/option.entity.ts
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Attributes } from "src/attribuite/entities/attribute-product.entity";
import { ParentProduct } from "src/parent/entities/parent-product.entity";
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
import { BeforeInsert } from "typeorm";
import { LongNumberEnum } from "src/base/enums/long-number";

@ObjectType()
@Entity("parent_option")
export class Option extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ParentProduct)
  @ManyToOne(() => ParentProduct)
  parentProduct: Promise<ParentProduct>;
  @Index()
  @JoinColumn({ name: 'parentProductId' })
  @Column()
  parentProductId: number;
    
  @Field(() => Attributes)
  @ManyToOne(() => Attributes)
  attribuite: Promise<Attributes>;
  @Index()
  @Column()
  attribuiteId: number;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @Column({ nullable: true })
  deletedAt: string; 
    
    
  @BeforeInsert()
  generateUniqueId() {

    this.id = Math.floor(Math.random() * LongNumberEnum.LONG);
  } 
}
