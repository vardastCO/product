// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Products } from 'src/product/entities/product.entity';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/optionValue.entity';
import { v4 as uuidv4 } from 'uuid';
import { Attributes } from 'src/attribuite/entities/attribute-product.entity';
import { AttribuiteValues } from 'src/attribuite-value/entities/value-service.entity';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { CacheTTL } from 'src/base/cache-ttl.util';
@Controller()
export class OptionController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}
  @MessagePattern({ cmd: 'update_option_parent' })
  async updateOptionParent(@Payload() data: any, @Ctx() context: any) {


  }

  @MessagePattern({ cmd: 'create_option_automatic' })
  async createOptionParent(@Payload() data: any, @Ctx() context: any) {
   const input  = this.decompressionService.decompressData(data.data)
   let product = null
   if(input.createOptionDto.productId) {
    product = await Products.findOne({
        where: [
            { id: input.createOptionDto.productId }
        ]
      });

      if (!product) {
          throw new Error('Product not found');
      }
    }
    try {
      const option = new Option();
      option.attribuiteId = input.createOptionDto.attribuiteId;
      option.parentProductId = input.createOptionDto.parentProductId ?? product.parentId; 
      await option.save();
      const optionId = option.id;
      await Promise.all(input.createOptionDto.valueIds.map(async valueId => {
        try {
          const optionValue = new OptionValue();
          optionValue.optionId = optionId;
          optionValue.valueId = valueId;

          const attribuitesName = await this.getAttribuitesById(input.createOptionDto.attribuiteId); 
          const valueName = await this.getValueById(valueId); 
          const productName = `${product.name} - ${attribuitesName} ${valueName}`;
          const new_product = await this.createNewProduct(productName, product.parentId)
          optionValue.productId = new_product.id
          await  optionValue.save();
        } catch(e) {
          console.log('promiese all option',e)
        }
      
      }));
      return true
    }catch(e){
      console.log('err createOptionParent',e)
      return false
    }
    
  }
  @MessagePattern({ cmd: 'create_option_manual' })
  async create_option_manual(@Payload() data: any, @Ctx() context: any) {
   const input  = this.decompressionService.decompressData(data.data)
    try {
      const option = new Option();
      option.attribuiteId = input.createOptionDto.attribuiteId;
      option.parentProductId = input.createOptionDto.parentProductId; 
      await option.save();
      const optionId = option.id;
      await Promise.all(input.createOptionDto.valueIds.map(async valueId => {
        try {
          const optionValue = new OptionValue();
          optionValue.optionId = optionId;
          optionValue.valueId = valueId;
          optionValue.productId = input.createOptionDto.productId;
          await  optionValue.save();
        } catch(e) {
          console.log('promiese all option',e)
        }
      
      }));
      return true
    }catch(e){
      console.log('err createOptionParent',e)
      return false
    }
    
  }

  async getValueById(valueId: number) {
    const cacheKey = `getValueById_value_${JSON.stringify(valueId)}`;
    const cachedData = await this.cacheManager.get<string>(cacheKey);
    if (cachedData) {
  
      return cachedData;
    }
    const attributeValue = await AttribuiteValues.findOne({ where: { id: valueId } });
    if (!attributeValue) {
      throw new Error(' value not found');
    }
    await this.cacheManager.set(cacheKey, attributeValue.value,CacheTTL.ONE_DAY);
    return attributeValue.value; 
  }

  async  getAttribuitesById(id: number) {
    const cacheKey = `getAttribuitesById_name_${JSON.stringify(id)}`;
    const cachedData = await this.cacheManager.get<string>(cacheKey);
    if (cachedData) {
  
      return cachedData;
    }
    const attributeValue = await Attributes.findOne({ where: { id: id } });
    if (!attributeValue) {
      throw new Error('Attribute not found');
    }
    await this.cacheManager.set(cacheKey, attributeValue.name,CacheTTL.ONE_DAY);
    return attributeValue.name; 
  }

  async createNewProduct(name: string, parentId: number) {
    try{
      let product = await Products.findOne({
        where: [
            { name }
        ]
      });

      if (product) {
          console.log('Product exist',product)
          throw new Error(`Product exist ${product.id} ` );
      }
      const newProduct = new Products();
      newProduct.name = name;
      newProduct.parentId = parentId;
      newProduct.sku      = uuidv4()
      await newProduct.save();
      return newProduct;
    }catch(e){
      console.log('err in createNewProduct',e)
    }

  }

  @MessagePattern({ cmd: 'getOptionsFromIds' })
  async getOptionsFromIds(@Payload() data: {productParentIds}, @Ctx() context: any) {
    const productIds: number[] = data.productParentIds;

    const productIdString = productIds.join(',');

    const query = `
          SELECT 
              o."parentProductId", 
              o."attribuiteId", 
              o.id AS option_id,
              a.name AS attribute_name,
              v."value" AS varient_value,
              ov."productId" AS product_id
          FROM 
              parent_option o
          JOIN 
              attributes_product_service a ON o."attribuiteId" = a.id
          JOIN 
              option_value  ov ON o."id" = ov."optionId"
          JOIN 
               values_product_service  v ON ov."valueId" = v.id
          WHERE 
              o."parentProductId" = ANY(array[${productIdString}])
              AND o."deletedAt" IS NULL;
        `;
  
  
    
    const response =  await this.dataSource.query(query);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;

  }
  @MessagePattern({ cmd: 'getVarientFromIds' })
  async getVarientFromIds(@Payload() data: {productParentIds}, @Ctx() context: any) {
   
    const id: number = data.productParentIds[0];

    const product = await Products.find({
      take:5,
      where: [
          { parentId : id }
      ]
    });

    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;

  }
  

  @MessagePattern({ cmd: 'remove_option' })
  async remove(@Payload() data: any, @Ctx() context: any) {

    const id = this.decompressionService.decompressData(data.data).id;

    const options = await Option.findOneBy({ id: id });
    if (!options) {
      throw new NotFoundException();
    }

    const optionsValues = await OptionValue.findBy({ optionId: options.id });
    if (optionsValues.length > 0) {
      for (const optionValue of optionsValues) {
        optionValue.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"}) 
        await optionValue.save(); 
      }
    }
    

    options.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})
    await options.save(); 
    
    return true;
  }


}
