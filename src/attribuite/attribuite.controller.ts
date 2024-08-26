// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { Like } from "typeorm";
import { Attributes } from './entities/attribute-product.entity';
import { PaginationAttribuitesResponse } from './dto/pagination-attribuites.response';
import { AttributeValueProduct } from 'src/attribuite-value/entities/attribute-value-product.entity';
@Controller()
export class AttribuiteController {

  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}


    
  @MessagePattern({ cmd: 'find_attribuite' })
  async find_attribuite(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);

  
      const attribuites: Attributes = await Attributes.findOneBy({ id: input.id });
  
      const compressedResponse = this.compressionService.compressData(attribuites);
  
      return compressedResponse;

    }catch(e){
     console.log('eee find_attribuite',e)
    }
    
   
    
  }
  @MessagePattern({ cmd: 'create_attribuite' })
  async create_attribuite(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);

  
      const attribuite = new Attributes()
      attribuite.name = input.createAttributeInput.name
      await attribuite.save()
  
      const compressedResponse = this.compressionService.compressData(attribuite);
  
      return compressedResponse;

    }catch(e){
     console.log('eee create_attribuite',e)
    }
    
   
    
  }
  @MessagePattern({ cmd: 'update_attribuite' })
  async update_attribuite(@Payload() data: any, @Ctx() context: any)  {

    try {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.updateSingleAttributeInput.id;
    const attribuites: Attributes = await Attributes.findOneBy({ id: id });
    if (!attribuites) {
      throw new NotFoundException();
    }
    attribuites.name = input.updateSingleAttributeInput.name !== undefined ? input.updateSingleAttributeInput.name : attribuites.name;
  
    await attribuites.save();
    const compressedResponse = this.compressionService.compressData(attribuites);

    return compressedResponse;

    }catch(e){
     console.log('eee update_attribuite',e)
    }
    
   
    
  }
 

  @MessagePattern({ cmd: 'remove_attribuite_value' })
  async remove_attribuite_value(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);
      const id = input.id

      const attributeValue: AttributeValueProduct = await AttributeValueProduct.findOne({
        where: [
            { id:id}
        ]
      });
      await attributeValue.remove();
      attributeValue.id = id;
      const productId = attributeValue.productId
      const compressedResponse = this.compressionService.compressData(productId);
  
      return compressedResponse;

    }catch(e){
     console.log('eee remove_attribuite_value',e)
    }
    
   
    
  }
  @MessagePattern({ cmd: 'update_attribuite_value' })
  async update_attribuite_value(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);
      const id = input.id
      const updateAttributeValue = input.updateAttributeValueInput
      const attributeValueProduct: AttributeValueProduct = await AttributeValueProduct.preload({
        id,
        ...updateAttributeValue,
      });
      if (!attributeValueProduct) {
        throw new NotFoundException();
      }
      await attributeValueProduct.save();

      console.log('attributeValueProduct',attributeValueProduct)

      const compressedResponse = this.compressionService.compressData(attributeValueProduct);
  
      return compressedResponse;
    }catch(e){
     console.log('eee update_attribuite_value',e)
    }
    
   
    
  }

    

  @MessagePattern({ cmd: 'pagination_attribuites' })
  async pagination_attribuite(@Payload() data: any, @Ctx() context: any)  {
    
    const indexAttribuiteInput = this.decompressionService.decompressData(data.data);

    const whereConditions: any = {};

    if (indexAttribuiteInput.indexAttribuiteInput.name) {
      whereConditions[`name`] = Like(`%${indexAttribuiteInput.indexAttribuiteInput.name}%`);
    }


    const [result, total] = await Attributes.findAndCount({
      take:indexAttribuiteInput.indexAttribuiteInput.take,
      skip:indexAttribuiteInput.indexAttribuiteInput.skip,
      where: whereConditions
    });

    const response = PaginationAttribuitesResponse.make(indexAttribuiteInput.indexAttribuiteInput, total, result);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;
    
  }


}
