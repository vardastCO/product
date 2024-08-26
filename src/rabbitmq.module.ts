// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { RabbitMQController } from './rabbitmq.controller';
import { typeOrmAsyncConfig } from './typeorm.config';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from './product/product.module';
import { BrnadModules } from './brand/brand.module';
import { UomModules } from './uom/uom.module';
import { CategoryModules } from './category/category.module';
import { ParentModules } from './parent/category.module';
import { OptionModules } from './option/option.module';
import { AttribuiteModules } from './attribuite/attribuite.module';
import { AttribuiteValueModules } from './attribuite-value/attribuiteValue.module';
import { CacheModule } from "@nestjs/cache-manager";
import { cacheAsyncConfig } from "./config/cache.config";
@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    CacheModule.registerAsync(cacheAsyncConfig),
    ProductModule,
    BrnadModules,
    UomModules,
    CategoryModules,
    ParentModules,
    OptionModules,
    AttribuiteModules,
    AttribuiteValueModules
  ],
  controllers: [RabbitMQController],
})
export class RabbitMQModules {}
