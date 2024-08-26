import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Brand } from "src/brand/entities/brand.entity";
import { Category } from "src/category/entities/category.entity";
import { Products } from "src/product/entities/product.entity";
import { Uom } from "src/uom/entities/uom.entity";

import {
  Column,
  Entity,
  ManyToOne,
  Index,
  BaseEntity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity("parent_product")
export class ParentProduct extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Brand)
  @ManyToOne(() => Brand, { eager: true })
  brand: Brand;
  @Index()
  @Column()
  brandId: number;

  @Field(() => Category)
  @ManyToOne(() => Category, { eager: true })
  category: Category;
  @Index()
  @Column()
  categoryId: number;

  @Field(() => Uom)
  @ManyToOne(() => Uom , { eager: true })
  uom: Uom;
  @Index()
  @Column()
  uomId: number;

  // @OneToMany(() => Products, products => products.parent)
  // products: Products[];
}
