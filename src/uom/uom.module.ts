// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { UomController } from './uom.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  providers: [CompressionService, DecompressionService],
  controllers: [UomController],
})
export class UomModules {}
