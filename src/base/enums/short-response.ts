import { registerEnumType } from "@nestjs/graphql";

export enum ShortResponse {
    SHORT =  3,
    
  
}

registerEnumType(ShortResponse, {
  name: "ShortResponse",
});
