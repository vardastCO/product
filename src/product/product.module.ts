import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';

@Module({
    controllers: [ProductController],
    providers: [CompressionService, DecompressionService],
})
export class ProductModule {}
