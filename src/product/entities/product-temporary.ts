import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ThreeStateSupervisionStatuses } from "src/base/utilities/enums/three-state-supervision-statuses.enum";
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



@ObjectType()
@Entity("product_temporary")
export class ProductTemporary extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column({ nullable: true })
  userId?: number = 1;


  @Field(() => Int, { nullable: true })
  @Index()
  @Column({ nullable: true })
  sellerId?: number = 1;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  description: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  category: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  brand: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  length: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  width: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  height: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  weight: string;

  @Field(() => ThreeStateSupervisionStatuses)
  @Column("enum", {
    enum: ThreeStateSupervisionStatuses,
    default: ThreeStateSupervisionStatuses.PENDING,
  })
  status: ThreeStateSupervisionStatuses;

  @Field()
  @Column({ nullable: true })
  deletedAt: string; 
}
