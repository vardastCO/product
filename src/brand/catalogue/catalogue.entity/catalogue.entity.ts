// src/brand/catalogue/catalogue.entity.ts
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Brand } from "src/brand/entities/brand.entity";
import { Entity, Column, PrimaryGeneratedColumn,BaseEntity,Index } from 'typeorm';
import {
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
  } from "typeorm";
@Entity("product_brands_catalogue")
@Index("idx_catalogue_name", ["name"])
export class Catalogue extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;
  
  @Field()
  @Index()
  @Column()
  name: string;
  
  @Field()
  @Index()
  @Column()
  description: string;

  @Field()
  @Index()
  @Column({ nullable: true, name: 'file_url' }) 
  fileUrl: string;

  @Field()
  @Column({ nullable: true, name: 'file_name' }) 
  @Index()
  fileName: string;

  @Field()
  @Column({ nullable: true, name: 'file_type' }) 
  fileType: string;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Index()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Brand, brand => brand.catalogues)
  brand: Brand; 

}
