import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { PaginationCategoryResponse } from './dto/pagination-category.response';
import { Category } from './entities/category.entity';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import { IsNull } from "typeorm";
import { ParentProduct } from 'src/parent/entities/parent-product.entity';
import { In } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Like } from "typeorm";
import {  ShortResponse } from 'src/base/enums/short-response';
@Controller()
export class CategoryController {
  
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource
    ) {}

  @MessagePattern({ cmd: 'pagination_categories' })
  async getPaginationBrand(@Payload() data: any, @Ctx() context: any)  {
    const indexCategoryInput = this.decompressionService.decompressData(data.data);
    const parentCategoryId = indexCategoryInput.indexCategoryInput.parentCategoryId ?? IsNull() ;
    ;
    let  [result, total] = [null , null]
    if (!indexCategoryInput.indexCategoryInput.brandId && !indexCategoryInput.indexCategoryInput.sellerId) {
       [result,total] = await this.getCategoryWithoutFilters(parentCategoryId, indexCategoryInput);
    } else if (indexCategoryInput.indexCategoryInput.brandId && !indexCategoryInput.indexCategoryInput.sellerId) {
      [result,total] = await this.getCategoryByBrandId(parentCategoryId, indexCategoryInput);
    } else if (!indexCategoryInput.indexCategoryInput.brandId && indexCategoryInput.indexCategoryInput.sellerId) {
      [result,total] = await this.getCategoryBySellerId(parentCategoryId, indexCategoryInput);
    }

    const compressedResponse = this.compressionService.compressData([result,total]);

    return compressedResponse;
  
  }

  @MessagePattern({ cmd: 'remove_category' })
  async remove_category(@Payload() data: any, @Ctx() context: any)  {

   
    const input = this.decompressionService.decompressData(data.data);
    const cat: Category = await Category.findOneBy({ id: input.id });
    if (!cat) {
      return false;
    }

    cat.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})

    await cat.save()

    const compressedResponse = this.compressionService.compressData(cat);

    return compressedResponse;
  
  }

  @MessagePattern({ cmd: 'update_category' })
  async update_category(@Payload() data: any, @Ctx() context: any)  {

   
    const input = this.decompressionService.decompressData(data.data);
    const cat: Category = await Category.findOneBy({ id: input.id });
    if (!cat) {
      return false;
    }

    cat.title = input.updateCategoryInput.title ?? cat.title
    cat.isActive = input.updateCategoryInput.isActive ?? true
    cat.sort = input.updateCategoryInput.sort ?? 0
    cat.slug = input.updateCategoryInput.slug ?? 0

    await cat.save()

    const compressedResponse = this.compressionService.compressData(cat);

    return compressedResponse;
  
  }


  @MessagePattern({ cmd: 'find_one_category' })
  async findOne(@Payload() data: any, @Ctx() context: any) {

    const id = this.decompressionService.decompressData(data.data).id;

    const brand: Category = await Category.findOneBy({ id: id ,deletedAt:IsNull()});
    if (!brand) {
      throw new NotFoundException();
    }

    const compressedResponse = this.compressionService.compressData(brand);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'search_category' })
  async search_category(@Payload() data: any, @Ctx() context: any)  {

    const input = (this.decompressionService.decompressData(data.data));

    const whereConditions: any = {};
  
    if (input.query.query) {
      whereConditions[`title`] = Like(`%${input.query.query}%`);
    }

    let  result  =  await Category.find({
      take:ShortResponse.SHORT,
      where: whereConditions,
      });
 

    const compressedResponse = this.compressionService.compressData(result);


    return compressedResponse;
  }
  @MessagePattern({ cmd: 'create_category' })
  async create(@Payload() data: any, @Ctx() context: any) {
    try { 
      const createCategoryInput = this.decompressionService.decompressData(data.data).createCategoryInput;

      const existingCategory = await Category.findOne({
        where: [
            { title: createCategoryInput.title }
        ]
      });
  
      if (existingCategory) {

        return this.compressionService.compressData(existingCategory)
      }
  
      const category = new Category();
      category.title = createCategoryInput.title;
      category.titleEn = createCategoryInput.titleEn; 
      category.description = createCategoryInput.description; 
      category.slug = createCategoryInput.slug; 

      await category.save();
  
      const compressedResponse = this.compressionService.compressData(category);
  
      return compressedResponse;

    } catch(e) {
      console.log(e)
      throw new Error('category with the same name or name_en already exists');
    } 

  }

  
  @MessagePattern({ cmd: 'getParentCategoriesFromIds' })
  async getParentCategoriesFromIds(@Payload() data: any, @Ctx() context: any) {
    try { 
 
      const input = this.decompressionService.decompressData(data.data);

     const response = await Category.find({
          where: {
              id: In(input.parentIds),
              deletedAt : IsNull()
          }
      });
      
      const compressedResponse = this.compressionService.compressData(response);
  
      return compressedResponse;

    } catch(e) {
      console.log(e)
      throw new Error('category with the same name or name_en already exists');
    } 

  }

  async getCategoryWithoutFilters(parentCategoryId, indexCategoryInput) {
    let queryBuilder = Category.createQueryBuilder()
      .skip(indexCategoryInput.indexCategoryInput.skip)
      .take(indexCategoryInput.indexCategoryInput.take)
      .where({
        hasImage: indexCategoryInput.indexCategoryInput.hasImage ?? false,
        parentCategoryId: parentCategoryId,
        isActive: indexCategoryInput.indexCategoryInput.isActive ?? true,
        deletedAt : IsNull()
      })
    ;

    if (indexCategoryInput.indexCategoryInput.sortField) {
      const { sortField, sortDirection } = indexCategoryInput.indexCategoryInput;
  
      switch (sortField) {
        case 'title':
          queryBuilder = queryBuilder.orderBy('title', sortDirection.toUpperCase());
          break;
        case 'productCount':
          queryBuilder = queryBuilder.orderBy('products_count', sortDirection.toUpperCase());
          break;
        case 'status':
          queryBuilder = queryBuilder.orderBy('status', sortDirection.toUpperCase());
          break;
        default:
          queryBuilder = queryBuilder.orderBy('sort', 'ASC');
      }
    } else {
      queryBuilder = queryBuilder.orderBy('sort', 'ASC');
    }
  

    if (indexCategoryInput.indexCategoryInput.name) {
      queryBuilder = queryBuilder.andWhere("title LIKE :title", 
       { title: `%${indexCategoryInput.indexCategoryInput.name}%` })
      ;
    }
  
    const [result, total] = await queryBuilder.getManyAndCount()

    return [result, total];
  }
  async  getCategoryByBrandId(parentCategoryId, indexCategoryInput) {
    try {
        const skip = indexCategoryInput.indexCategoryInput.skip
        const take = indexCategoryInput.indexCategoryInput.take
      
        const sqlQuery = `
            SELECT DISTINCT "categoryId"
            FROM parent_product
            WHERE "brandId" = ${indexCategoryInput.indexCategoryInput.brandId}
            LIMIT ${take}
            OFFSET ${skip}
        `;
        const categoryIdsResult = await this.dataSource.query(sqlQuery)

        const categoryIds = categoryIdsResult.map(row => row.categoryId);

        const [response, total] = await Category.findAndCount({
            where: {
                id: In(categoryIds),
                deletedAt : IsNull()
            }
        });

        return [response , total ];
    } catch (error) {
        // Handle error
        console.error("Error in getCategoryByBrandId:", error);
    }
  }
  async  getCategoryBySellerId(parentCategoryId, indexCategoryInput) {
    try {
        const skip = indexCategoryInput.indexCategoryInput.skip
        const take = indexCategoryInput.indexCategoryInput.take
      
        const sellerId = indexCategoryInput.indexCategoryInput.sellerId;

        const sqlQuery = `
            SELECT DISTINCT parent_product."categoryId"
            FROM parent_product
            JOIN products ON parent_product."id" = products."parentId"
            JOIN product_offers ON products.id = product_offers."productId"
            WHERE product_offers."sellerId" = ${sellerId}
            LIMIT ${take}
            OFFSET ${skip}
        `;
        const categoryIdsResult = await this.dataSource.query(sqlQuery)

        const categoryIds = categoryIdsResult.map(row => row.categoryId);

        const [response, total] = await Category.findAndCount({
            where: {
                id: In(categoryIds),
                deletedAt : IsNull()
            }
        });

        return [response , total ];
    } catch (error) {
        // Handle error
        console.error("Error in getCategoryBySellerId:", error);
    }
  }
}
