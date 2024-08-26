import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AttributeValueProduct } from "src/attribuite-value/entities/attribute-value-product.entity";
import { ThreeStateSupervisionStatuses } from "src/base/utilities/enums/three-state-supervision-statuses.enum";
import { Offer } from "src/offer/entities/offer.entity";
import { ParentProduct } from "src/parent/entities/parent-product.entity";
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
@Entity("products")
export class Products extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  description: string;

  @Field()
  @Column()
  sku: string;

  @Field({ nullable: true })
  @Column({ nullable: true})
  techNum: string;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column({ nullable: true })
  rating?: number = 4;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column({ nullable: true })
  rank?: number = 1;

  @Field(() => ParentProduct) 
  @JoinColumn()
  @Index()
  @ManyToOne(() => ParentProduct)
  parent: ParentProduct;
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true }) 
  parentId: number;

  @Field(() => ThreeStateSupervisionStatuses)
  @Column("enum", {
    enum: ThreeStateSupervisionStatuses,
    default: ThreeStateSupervisionStatuses.CONFIRMED,
  })
  status: ThreeStateSupervisionStatuses;

  @Field(() => [Offer], { nullable: "items" })
  @OneToMany(() => Offer, offer => offer.product)
  offers: Promise<Offer[]>;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  offers_count?: number = 0;

  @Field(() => Int, { nullable: true })
  @Column( {nullable: true })
  views?: number= 0;

  @Field()
  @Column({ nullable: true })
  deletedAt: string; 
}
