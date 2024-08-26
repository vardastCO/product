import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import { Attributes } from "src/attribuite/entities/attribute-product.entity";
import { Category } from "src/category/entities/category.entity";

@Entity("category_filter")
@ObjectType()
@Index(["attribuiteId", "categoryId"], { unique: true }) 
export class FilterCategory extends BaseEntity {
  
  @Field(() =>  Int)
  // @Index()
  // @ManyToOne(() => Attributes, { eager: true })
  // attribute: Attributes;
  @PrimaryColumn()
  attribuiteId: number;


  @Field(() => Category)
  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @Field(() => Int)
  @PrimaryColumn()
  @Index()
  categoryId: number;
}
