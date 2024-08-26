import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { Products } from "../entities/product.entity";


@ObjectType()
export class PaginationProductResponse extends PaginationResponse {
  @Field(() => [Products], { nullable: "items" })
  data: Products[];
}
