// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { CatalogueModule } from './catalogue/catalogue.module';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  imports: [CatalogueModule],
  providers: [CompressionService, DecompressionService],
  controllers: [BrandController],
})
export class BrnadModules {}
