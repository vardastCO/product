import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ProductTemporaryInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  length?: string;

  @Field({ nullable: true })
  width?: string;

  @Field({ nullable: true })
  height?: string;

  @Field({ nullable: true })
  weight?: string;
}
