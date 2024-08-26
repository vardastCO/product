// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { Like } from "typeorm";
import { AttribuiteValues } from './entities/value-service.entity';
import { PaginationAttribuitesValueResponse } from './dto/pagination-attribuites-values.response';
import { FilterCategory } from './entities/filter-category.entity';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
@Controller()
export class AttribuiteValueController {

  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

  @MessagePattern({ cmd: 'pagination_values_attribuites' })
  async pagination_values_attribuites(@Payload() data: any, @Ctx() context: any)  {
    
    const indexAttribuiteInput = this.decompressionService.decompressData(data.data);

    const whereConditions: any = {};

    if (indexAttribuiteInput.indexAttribuiteInput.name) {
      whereConditions[`name`] = Like(`%${indexAttribuiteInput.indexAttribuiteInput.name}%`);
    }


    const [result, total] = await AttribuiteValues.findAndCount({
      take:indexAttribuiteInput.indexAttribuiteInput.take,
      skip:indexAttribuiteInput.indexAttribuiteInput.skip,
      where: whereConditions
    });

    const response = PaginationAttribuitesValueResponse.make(indexAttribuiteInput.indexAttribuiteInput, total, result);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;
    
  }

  @MessagePattern({ cmd: 'pagination_values' })
  async pagination_values(@Payload() data: any, @Ctx() context: any)  {
    
    const indexValueInput = this.decompressionService.decompressData(data.data);

    const whereConditions: any = {};

    if (indexValueInput.indexValueInput.value) {
      whereConditions[`value`] = indexValueInput.indexValueInput.value;
      // whereConditions[`value`] = Like(`%${indexValueInput.indexValueInput.value}%`);
    }


    const [result, total] = await AttribuiteValues.findAndCount({
      take:indexValueInput.indexValueInput.take,
      skip:indexValueInput.indexValueInput.skip,
      where: whereConditions
    });

    const response = PaginationAttribuitesValueResponse.make(indexValueInput.indexValueInput, total, result);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;
    
  }


  @MessagePattern({ cmd: 'create_attribuite_value' })
  async create_attribuite_value(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);

  
      const value = new AttribuiteValues()
      value.value = input.createSingleValueInput.value
      await value.save()
  
      const compressedResponse = this.compressionService.compressData(value);
  
      return compressedResponse;

    }catch(e){
     console.log('eee create_attribuite_value',e)
    }
    
   
    
  }
  
  @MessagePattern({ cmd: 'add_category_filter' })
  async add_category_filter(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);
      console.log('input',input)
        const query = `
            INSERT INTO category_filter ("attribuiteId", "categoryId")
            VALUES (${input.attrribuite_id}, ${input.category_id})
        `;
      const response =  await this.dataSource.query(query);
      console.log('response',response)
  
      return true;

    }catch(e){
     console.log('eee create_attribuite_value',e)
    }
    
   
    
  }
  @MessagePattern({ cmd: 'remove_category_filter' })
  async remove_category_filter(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);

     const filter: FilterCategory = await FilterCategory.findOneBy({ 
      attribuiteId: input.attrribuite_id,
      categoryId:input.category_id
      });
      if (!filter) {
          return false
      }
    
      await filter.remove();
  
      return true;

    }catch(e){
     console.log('eee remove_category_filter',e)
    }
    
   
    
  }
  @MessagePattern({ cmd: 'update_value_service' })
  async update_value_service(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = this.decompressionService.decompressData(data.data);

      const id = input.updateSingleAttributeInput.id;
      const attribuites: AttribuiteValues = await AttribuiteValues.findOneBy({ id: id });
      if (!attribuites) {
        throw new NotFoundException();
      }
      attribuites.value = input.value !== undefined ? input.value : attribuites.value;
    
      await attribuites.save();
      const compressedResponse = this.compressionService.compressData(attribuites);
  
      return compressedResponse;

    }catch(e){
     console.log('eee create_attribuite_value',e)
    }
    
   
    
  }


}
