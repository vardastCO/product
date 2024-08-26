// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { OptionController } from './option.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  providers: [CompressionService, DecompressionService],
  controllers: [OptionController],
})
export class OptionModules {}
