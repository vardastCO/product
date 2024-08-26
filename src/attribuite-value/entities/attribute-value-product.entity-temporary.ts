import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AttribuiteValues } from "./value-service.entity";
import { ProductTemporary } from "src/product/entities/product-temporary";
import { Attributes } from "src/attribuite/entities/attribute-product.entity";


@Entity("attributes_value_product_temporary_service")
@ObjectType()
export class AttributeValueProductTemporary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column()
  product_temporary_id: number;
  
  @Field(() => ProductTemporary)
  @Index()
  @ManyToOne(() => ProductTemporary, { eager: true })
  product_temporary: ProductTemporary;

  @Field(() => Attributes)
  @Index()
  @ManyToOne(() => Attributes, { eager: true })
  attribute: Attributes;
  @Column()
  attributeId: number;

  @Field(() => AttribuiteValues)
  @ManyToOne(() => AttribuiteValues, { eager: true })
  value: AttribuiteValues;

  @Column()
  @Index()
  valueId: number;
}
