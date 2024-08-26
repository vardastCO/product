import { registerEnumType } from "@nestjs/graphql";

export enum SortBrandEnum {
  RATING = 'rating',
  MOST_PRODUCT = 'sum',
  NEWEST = 'createdAt',
}

registerEnumType(SortBrandEnum, { name: "SortBrandEnum" });
