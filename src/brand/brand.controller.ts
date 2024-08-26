// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { Brand } from './entities/brand.entity';
import { In } from "typeorm";
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { SortBrandEnum } from './enums/sortBrandEnum';
import { Like } from "typeorm";
import { ShortResponse } from 'src/base/enums/short-response';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, IsNull } from "typeorm";
@Controller()
export class BrandController {

  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource
    ) {}
  @MessagePattern({ cmd: 'search_brands' })
  async search_brands(@Payload() data: any, @Ctx() context: any)  {

    const input = (this.decompressionService.decompressData(data.data));

    const whereConditions: any = {};
  
    if (input.query.query) {
      whereConditions[`name`] = Like(`%${input.query.query}%`);
    }
    

    let  result  =  await Brand.find({
      take :  ShortResponse.SHORT,
      where: whereConditions,
    });
  

    const compressedResponse = this.compressionService.compressData(result);


    return compressedResponse;
  }
  
  @MessagePattern({ cmd: 'filter_brand_by_category' })
  async filter_brand_by_category(@Payload() data: any, @Ctx() context: any)  {

    try {
      const input = (this.decompressionService.decompressData(data.data));
      const categoryId = input.categoryId;

      const sqlQuery = `
        SELECT DISTINCT po."brandId"
        FROM parent_product po
        WHERE po."categoryId" = ${categoryId}
        LIMIT 50;
      `
      const brandIdsResult = await this.dataSource.query(sqlQuery)

      const brandIds = brandIdsResult.map(row => row.brandId);

      const response = await Brand.find({
          where: {
              id: In(brandIds),
              deletedAt : IsNull()
          }
      });

      const compressedResponse = this.compressionService.compressData(response);

      return compressedResponse;
  } catch (error) {
      // Handle error
      console.error("Error in getCategoryBySellerId:", error);
  }

  }
  async getPaginationBrandFilterSeller(data:any)  {
    try {
      const skip = data.indexBrandInput.skip
      const take = data.indexBrandInput.take
    
      const sellerId = data.indexBrandInput.sellerId;

      const sqlQuery = `
             
        SELECT DISTINCT "parent_product"."brandId" 
        FROM product_offers po 
        JOIN products p ON po."productId" = p."id"
        JOIN parent_product ON p."parentId" = parent_product.id 
        WHERE po."sellerId" =  ${sellerId}
        LIMIT ${take}
        OFFSET ${skip}
 
      `;
      const brandIdsResult = await this.dataSource.query(sqlQuery)

      const brandIds = brandIdsResult.map(row => row.brandId);

      const [response, total] = await Brand.findAndCount({
          where: {
              id: In(brandIds),
              deletedAt : IsNull()
          }
      });

      const compressedResponse = this.compressionService.compressData([response,total]);

      return compressedResponse;
  } catch (error) {
      // Handle error
      console.error("Error in getCategoryBySellerId:", error);
  }


  }

  async getPaginationBrandFilterCategory(data:any)  {
    try {
      const skip = data.indexBrandInput.skip
      const take = data.indexBrandInput.take
    
      const categoryId = data.indexBrandInput.categoryId;

      const sqlQuery = `
        SELECT DISTINCT po."brandId" 
        FROM parent_product po 
        WHERE po."categoryId" =  ${categoryId}
        LIMIT ${take}
        OFFSET ${skip}
 
      `;
      const brandIdsResult = await this.dataSource.query(sqlQuery)

      const brandIds = brandIdsResult.map(row => row.brandId);

      const [response, total] = await Brand.findAndCount({
          where: {
              id: In(brandIds),
              deletedAt : IsNull()
          }
      });

      const compressedResponse = this.compressionService.compressData([response,total]);

      return compressedResponse;
  } catch (error) {
      // Handle error
      console.error("Error in getCategoryBySellerId:", error);
  }


  }
  @MessagePattern({ cmd: 'pagination_brand' })
  async getPaginationBrand(@Payload() data: any, @Ctx() context: any)  {
    
    const indexBrandInput = this.decompressionService.decompressData(data.data);

    if ( indexBrandInput.indexBrandInput.sellerId){
      return this.getPaginationBrandFilterSeller(indexBrandInput)
    }

    if ( indexBrandInput.indexBrandInput.categoryId){
      return this.getPaginationBrandFilterCategory(indexBrandInput)
    }

    const whereConditions: any = {};
    const order: any = {}
    whereConditions.deletedAt = IsNull();
    const { sortField, sortDirection } = indexBrandInput.indexBrandInput;
    switch (sortField) {
      case SortBrandEnum.NEWEST:
        order['createdAt'] = sortDirection;
        break;
      case SortBrandEnum.RATING:
        order['rating'] = sortDirection;
        break;
      case SortBrandEnum.MOST_PRODUCT:
        order['sum'] = sortDirection;
        break;
    }
    if (indexBrandInput.indexBrandInput.name) {
      whereConditions[`name`] = Like(`%${indexBrandInput.indexBrandInput.name}%`);
    }
    if (indexBrandInput.indexBrandInput.name_en) {
      whereConditions[`name_en`] = Like(`%${indexBrandInput.indexBrandInput.name_en}%`);
    }
    if (indexBrandInput.indexBrandInput.hasPriceList !== undefined) {
      whereConditions[`hasPriceList`] = indexBrandInput.indexBrandInput.hasPriceList;
    }
    if (indexBrandInput.indexBrandInput.hasCatalogeFile !== undefined) {
      whereConditions[`hasCatalogeFile`] = indexBrandInput.indexBrandInput.hasCatalogeFile;
    }

    const [result, total] = await Brand.findAndCount({
      take:indexBrandInput.indexBrandInput.take,
      skip:indexBrandInput.indexBrandInput.skip,
      where: whereConditions,
      order: order,
    });

    const compressedResponse = this.compressionService.compressData([result,total]);

    return compressedResponse;
    
  }

  @MessagePattern({ cmd: 'filter_brand_by_seller' })
  async filter_brand_by_seller(@Payload() data: any, @Ctx() context: any)  {
    
        const input = this.decompressionService.decompressData(data.data);

        const sqlQuery = `
                
        SELECT DISTINCT "parent_product"."brandId" 
        FROM product_offers po 
        JOIN products p ON po."productId" = p."id"
        JOIN parent_product ON p."parentId" = parent_product.id 
        WHERE po."sellerId" =  ${input.sellerId}
        LIMIT 3

      `;
      const brandIdsResult = await this.dataSource.query(sqlQuery)

      const brandIds = brandIdsResult.map(row => row.brandId);

      const response = await Brand.find({
          where: {
              id: In(brandIds),
              deletedAt : IsNull()
          }
      });

      const compressedResponse = this.compressionService.compressData(response);

      return compressedResponse;
    
  }

  @MessagePattern({ cmd: 'create_brand' })
  async createBrand(@Payload() data: any, @Ctx() context: any)  {
    
    const input = this.decompressionService.decompressData(data.data);

    const existingBrand = await Brand.findOne({
      where: [
          { name_fa: input.createBrandInput.name_fa }
      ]
    });

    if (existingBrand) {
        throw new Error('Brand with the same name or name_en already exists');
    }

    const brand = new Brand();
    brand.name_en = input.createBrandInput.name_en; 
    brand.name_fa = input.createBrandInput.name_fa; 
    brand.made_in = input.createBrandInput.made_in ?? null; 
    brand.province_id = input.createBrandInput.province_id ?? null;
    brand.city_id = input.createBrandInput.city_id ?? null;
    brand.sum = 1; 
    brand.rating = input.createBrandInput.rating; 

    if (input.createBrandInput.name_fa && input.createBrandInput.name_en) {
      brand.name = `${input.createBrandInput.name_fa} (${input.createBrandInput.name_en})`;
    } else if (input.createBrandInput.name_fa) {
      brand.name = input.createBrandInput.name_fa;
    }
    await brand.save();

    const compressedResponse = this.compressionService.compressData(brand);

    return compressedResponse;
    
  }


  @MessagePattern({ cmd: 'find_one_brand' })
  async findOne(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.brandId;

    const brand: Brand = await Brand.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException();
    }

    const compressedResponse = this.compressionService.compressData(brand);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'update_brand' })
  async update_brand(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.updateBrandInput.id;
    const brand: Brand = await Brand.findOneBy({ id: id });
    if (!brand) {
      throw new NotFoundException();
    }
    Object.assign(brand, input.updateBrandInput);

    await brand.save();
    const compressedResponse = this.compressionService.compressData(brand);

    return compressedResponse;
  }
  @MessagePattern({ cmd: 'remove_brand' })
  async remove_brand(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.id;

    const brand: Brand = await Brand.findOneBy({ id: id });
    if (!brand) {
      return false
    }

    brand.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})
    await brand.save()
    return true
  }



  @MessagePattern({ cmd: 'find_brands_by_ids' })
  async findByIds(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);

    const product: Brand[] = await  Brand.findBy({
      id: In(input.ids),
    });
    if (!product) {
      throw new NotFoundException();
    }
    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
  }

}
