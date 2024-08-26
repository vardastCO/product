import { Field, ObjectType } from "@nestjs/graphql";
import { PaginationResponse } from "src/base/dto/pagination.response";
import { ParentProduct} from "../entities/parent-product.entity";


@ObjectType()
export class PaginationParentResponse extends PaginationResponse {
  @Field(() => [ParentProduct], { nullable: "items" })
  data: ParentProduct[];
}
