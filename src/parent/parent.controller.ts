// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import * as zlib from 'zlib';
import { PaginationProductResponse } from 'src/product/dto/pagination-product.response';
import { ParentProduct } from './entities/parent-product.entity';
@Controller()
export class ParentController {

  @MessagePattern({ cmd: 'pagination_parent' })
  async getPaginationBrand(@Payload() data: any, @Ctx() context: any) {

      console.log('Received data:', data);
      const base64Data = data.data;
      // Decode base64 and decompress the base64Data
      const compressedData = Buffer.from(base64Data, 'base64');
      const decompressedData = zlib.gunzipSync(compressedData).toString();


      const indexParentInput = JSON.parse(decompressedData);

  
      const [result, total] = await ParentProduct.findAndCount({
          take: 10,
          // Add any conditions here based on the received data
      });
  
      const response = PaginationProductResponse.make(indexParentInput, total, result);
      const compressedResponse = zlib.gzipSync(JSON.stringify(response));

    // Return the compressed response
    return compressedResponse.toString('base64');
  }
  

  @MessagePattern({ cmd: 'find_one_parent' })
  async findOne(@Payload() data: any, @Ctx() context: any) {

    const id = data.id;
    const parent: ParentProduct = await ParentProduct.findOneBy({ id: id });
    if (!parent) {
      throw new NotFoundException();
    }

    return JSON.stringify(parent);
  }


  @MessagePattern({ cmd: 'remove_parent' })
  async remove(@Payload() data: any, @Ctx() context: any) {
    const id = data.id;
    const parent = await ParentProduct.findOneBy({ id: id });
    if (!parent) {
      throw new NotFoundException();
    }
    await parent.remove();
   
    return JSON.stringify(parent);
  }
}
