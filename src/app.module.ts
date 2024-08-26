import { Module } from '@nestjs/common';
import { CompressionService } from './compression.service';
import { DecompressionService } from './decompression.service';


@Module({
  imports: [],
  providers: [CompressionService, DecompressionService],
  exports: [CompressionService, DecompressionService], 
})
export class AppModule {}
