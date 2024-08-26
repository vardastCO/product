import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm"

@Entity("values_product_service")
export class AttribuiteValues extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  @Index()
  id: number;
  
  @Field()
  @Column({ unique: true })
  @Index()
  value: string;
  
}
