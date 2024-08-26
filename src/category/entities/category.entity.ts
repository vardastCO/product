import { Field, Int, ObjectType } from "@nestjs/graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Index("idx_category_title", ["title"])
@Entity("base_taxonomy_categories")
export class Category extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, category => category?.children, { nullable: true })
  parentCategory?: Promise<Category>;

  @Column({ nullable: true })
  parentCategoryId?: number;

  @Field(() => [Category], { nullable: "items" })
  @OneToMany(() => Category, category => category.parentCategory)
  children: Category[];

  @Field()
  @Column({ unique: true })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true   })
  titleEn?: string;

  @Field({ nullable: true })
  @Column({nullable: true  })
  slug?: string;

  @Field({ nullable: true })
  @Column({nullable: true })
  description?: string;


  @Field({ nullable: true })
  @Column({nullable: true })
  url?: string;

  @Field(() => Int)
  @Column("int4", { default: 0 })
  sort = 0;

  @Field(() => Int)
  @Column("int4", { default: 0 })
  products_count = 0;

  @Field(() => Int)
  @Column("int4", { default: 0 })
  childCount = 0;

  @Field({ defaultValue: true })
  @Column({ default: true })
  isActive: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasImage: boolean;

  @Field({ nullable: true })
  @CreateDateColumn({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  deletedAt: string; 

}
