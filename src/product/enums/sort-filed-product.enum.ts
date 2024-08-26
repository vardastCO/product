import { registerEnumType } from "@nestjs/graphql";

export enum SortFieldProduct {
  RATING = 'rating',
  TIME = 'createdAt',
  PRICE = 'price',
  NAME = 'name',
}

registerEnumType(SortFieldProduct, {
  name: "SortFieldProduct",
});
