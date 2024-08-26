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
@Entity("product_attribuite_temporary")
export class ProductAttribuiteTemporary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  attribuite: string;

  @Field()
  @Column()
  value: string;

  @Field(() => ProductTemporary) 
  @JoinColumn()
  @Index()
  @ManyToOne(() => ProductTemporary)
  product_temp: ProductTemporary;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true }) 
  product_temp_id: number;
}
