import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { Attributes } from "../entities/attribute-product.entity";

@ObjectType()
export class PaginationAttribuitesResponse extends PaginationResponse {
  @Field(() => [Attributes], { nullable: "items" })
  data: Attributes[];
}
