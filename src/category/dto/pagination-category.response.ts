import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { Category } from "../entities/category.entity";

@ObjectType()
export class PaginationCategoryResponse extends PaginationResponse {
  @Field(() => [Category], { nullable: "items" })
  data: Category[];
}
