// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  
  providers: [CompressionService, DecompressionService],
  controllers: [CategoryController],
})
export class CategoryModules {}
