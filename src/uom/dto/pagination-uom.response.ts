import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { Uom } from "../entities/uom.entity";

@ObjectType()
export class PaginationUOMResponse extends PaginationResponse {
  @Field(() => [Uom], { nullable: "items" })
  data: Uom[];
}
