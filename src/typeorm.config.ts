import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { Brand } from "./brand/entities/brand.entity";
import { Uom } from "./uom/entities/uom.entity";
import { Category } from "./category/entities/category.entity";
import { ParentProduct } from "./parent/entities/parent-product.entity";
import { Products } from "./product/entities/product.entity";
import { Catalogue } from "./brand/catalogue/catalogue.entity/catalogue.entity";
import { Attributes } from "./attribuite/entities/attribute-product.entity";
import { AttribuiteValues } from "./attribuite-value/entities/value-service.entity";
import { AttributeValueProduct } from "./attribuite-value/entities/attribute-value-product.entity";
import { FilterCategory } from "./attribuite-value/entities/filter-category.entity";
import { Option } from "./option/entities/option.entity";
import { OptionValue } from "./option/entities/optionValue.entity";
import { ProductTemporary } from "./product/entities/product-temporary";
import { Offer } from "./offer/entities/offer.entity";
import { ProductFileTemporary } from "./product/entities/product-file-temporary";
import { ProductAttribuiteTemporary } from "./product/entities/product-attribuite-temporary";


export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: "postgres",
      host: configService.get("DB_HOST", "database"),
      port: parseInt(configService.get("DB_PORT", "5432")),
      username: configService.get("DB_USERNAME", "postgres"),
      password: configService.get("DB_PASSWORD", "vardast@1234"),
      database: configService.get("DB_NAME", "v2"),
      synchronize: configService.get("DB_SYNC", "true") === "true",
      logging: configService.get("DB_QUERY_LOG", "true") === "true",
      entities: [
        Brand,
        Uom,
        Category,
        ParentProduct,
        Products,
        Catalogue,
        Attributes,
        AttribuiteValues,
        AttributeValueProduct,
        FilterCategory,
        Option,
        OptionValue,
        ProductTemporary,
        Offer,
        ProductFileTemporary,
        ProductAttribuiteTemporary

      ],
    };
  },
};
