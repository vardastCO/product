import { Field, ObjectType } from "@nestjs/graphql";
import { Brand } from "../entities/brand.entity";
import { PaginationResponse } from "src/base/dto/pagination.response";

@ObjectType()
export class PaginationBrandResponse extends PaginationResponse {
  @Field(() => [Brand], { nullable: "items" })
  data: Brand[];
}
