// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { AttribuiteValueController } from './attribuiteValue.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  providers: [CompressionService, DecompressionService],
  controllers: [AttribuiteValueController],
})
export class AttribuiteValueModules {}
