// src/product/product.entity.ts
import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
import { Catalogue } from "../catalogue/catalogue.entity/catalogue.entity";
@Entity("product_brands")
@Index("idx_brand_name", ["name"])
export class  Brand extends BaseEntity{
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name_en?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name_fa?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  made_in?: string;

  @Field(() => Int, { defaultValue: 1 })
  @Column( )
  sum : number;


  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  slug?: string;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  rating?: number= 4;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  province_id?: number;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  city_id?: number;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  views?: number= 0;


  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  sellersCount?: number = 0;

  
  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  categoriesCount?: number= 0;

  @OneToMany(() => Catalogue, catalogue => catalogue.brand)
  catalogues: Catalogue[];


  @Field({ nullable: true })
  @Column({nullable: true })
  bio?: string;


  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false }) 
  hasPriceList?: boolean;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  hasCatalogeFile?: boolean;


  @Field()
  @Column({ nullable: true })
  deletedAt: string; 
}
