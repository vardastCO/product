import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attributes } from "src/attribuite/entities/attribute-product.entity";
import { AttribuiteValues } from "./value-service.entity";

@Entity("attributes_value_product_service")
@ObjectType()
export class AttributeValueProduct extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column()
  productId: number;
  
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
