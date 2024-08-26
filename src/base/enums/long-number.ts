import { registerEnumType } from "@nestjs/graphql";

export enum LongNumberEnum {
  LONG = 100000000000,
  
}

registerEnumType(LongNumberEnum, {
  name: "LongNumberEnum",
});
