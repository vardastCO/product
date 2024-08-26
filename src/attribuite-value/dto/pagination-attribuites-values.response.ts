import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { AttribuiteValues } from "../entities/value-service.entity";

@ObjectType()
export class PaginationAttribuitesValueResponse extends PaginationResponse {
  @Field(() => [AttribuiteValues], { nullable: "items" })
  data: AttribuiteValues[];
}
