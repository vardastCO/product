// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { AttribuiteController } from './attribuite.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
  providers: [CompressionService, DecompressionService],
  controllers: [AttribuiteController],
})
export class AttribuiteModules {}
