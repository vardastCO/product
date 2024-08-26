import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  Index,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { ProductTemporary } from "./product-temporary";



@ObjectType()
@Entity("product_file_temporary")
export class ProductFileTemporary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true }) 
  file_id: number;

  @Field(() => ProductTemporary) 
  @JoinColumn()
  @Index()
  @ManyToOne(() => ProductTemporary)
  product_temp: ProductTemporary;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true }) 
  product_temp_id: number;
}
