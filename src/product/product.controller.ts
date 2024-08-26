import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { Products } from './entities/product.entity';
import { CompressionService } from 'src/compression.service';
import { DecompressionService } from 'src/decompression.service';
import {  Not } from "typeorm";
import { In,IsNull } from "typeorm";
import { Like } from "typeorm";
import { AttributeValueProduct } from 'src/attribuite-value/entities/attribute-value-product.entity';
import { ShortResponse } from 'src/base/enums/short-response';
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ProductTemporary } from './entities/product-temporary';
import { ThreeStateSupervisionStatuses } from 'src/base/utilities/enums/three-state-supervision-statuses.enum';
import { SortFieldProduct } from './enums/sort-filed-product.enum';
import { ParentProduct } from 'src/parent/entities/parent-product.entity';
import { ProductAttribuiteTemporary } from './entities/product-attribuite-temporary';
import { ProductFileTemporary } from './entities/product-file-temporary';
@Controller()
export class ProductController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService ,
    @InjectDataSource() private readonly dataSource: DataSource,
    ) {}

  @MessagePattern({ cmd: 'pagination_product' })
  async pagination_product(@Payload() data: any, @Ctx() context: any)  {

    const indexProductInput = (this.decompressionService.decompressData(data.data)).indexProductInput;

    const whereConditions: any = {}
    whereConditions.deletedAt = IsNull();

    if (indexProductInput.categoryIds && indexProductInput.categoryIds.length > 0) {
      whereConditions.parent = {
        categoryId:  In(indexProductInput.categoryIds),
      };
    }
    if (indexProductInput.query) {
      whereConditions[`name`] = Like(`%${indexProductInput.query}%`);
    }
   
    if (indexProductInput.sellerId) {
      whereConditions.offers = {
        sellerId: indexProductInput.sellerId,
      };
    }

    if (indexProductInput.branId) {
      whereConditions.parent = {
        brandId: indexProductInput.branId,
      };
    }

    const order: any = {}
    const { sortField, sortDirection } = indexProductInput;

    switch (sortField) {
      case SortFieldProduct.TIME:
        order['id'] = sortDirection;
        break;
      case SortFieldProduct.NAME:
        order['name'] = sortDirection;
        break;
      case SortFieldProduct.RATING:
        order['rating'] = sortDirection;
        break;
    }

    let  [result, total]  =  await Products.findAndCount({
        take: indexProductInput.take,
        skip: indexProductInput.skip,
        order: order,
        where  : whereConditions
      });
 

    const compressedResponse = this.compressionService.compressData([result,total]);


    return compressedResponse;
  }
  @MessagePattern({ cmd: 'create_product' })
  async create_product(@Payload() data: any, @Ctx() context: any)  {
    
    const input = this.decompressionService.decompressData(data.data);

    const existingProduct = await Products.findOne({
      where: [
          { name: input.createProductInput.name }
      ]
    });

    if (existingProduct) {
        throw new Error('product with the same name or name_en already exists');
    }

    const product = new Products();
    product.name = input.createProductInput.name;
    product.description = input.createProductInput.description; 
    
    const parent = new ParentProduct();
    parent.name = input.createProductInput.name;
    parent.categoryId = input.createProductInput.categoryId; 
    parent.brandId = input.createProductInput.brandId; 
    parent.uomId = input.createProductInput.uomId
    await parent.save()
    product.parentId = parent.id
    await product.save();

    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
    
  }

 @MessagePattern({ cmd: 'create_varient_exist_product' })
  async create_varient_exist_product(@Payload() data: any, @Ctx() context: any)  {

    try{
      const input = this.decompressionService.decompressData(data.data);

      const orginal_produtc = await Products.findOne({
        where: [
            { id: input.orginal_produtc_id }
        ]
      });

  
      if (!orginal_produtc) {
          throw new Error('orginal_produtc with the same name or name_en already not exists');
      }
  
      const similar_produtc = await Products.findOne({
        where: [
            { id: input.similar_produtc_id }
        ]
      });

      if (!similar_produtc) {
          throw new Error('similar_produtc with the same name or name_en already not exists');
      }
  
      similar_produtc.parentId = orginal_produtc.parentId
      
      await similar_produtc.save()

  
      const compressedResponse = this.compressionService.compressData(orginal_produtc);
  
      return compressedResponse;
    }catch(e)
    {
      console.log('error at create_varient_exist_product ',e)
    }    
    
    
  }
  @MessagePattern({ cmd: 'update_product' })
  async update_product(@Payload() data: any, @Ctx() context: any)  {
    
    const input = this.decompressionService.decompressData(data.data);

    const existingProduct = await Products.findOne({
      where: [
          { id: input.updateProductInput.id }
      ]
    });

    if (!existingProduct) {
        throw new Error('product with the same name or name_en already not exists');
    }

    const existingParent = await ParentProduct.findOne({
      where: [
          { id: existingProduct.parentId }
      ]
    });

    if (!existingParent) {
        throw new Error('parent with the same name or name_en already not exists');
    }

    existingProduct.name = input.updateProductInput.name !== undefined ? input.updateProductInput.name : existingProduct.name;
    existingProduct.description = input.updateProductInput.description !== undefined ? input.updateProductInput.description : existingProduct.description;

    existingParent.name = input.updateProductInput.parent_name !== undefined ? input.updateProductInput.parent_name : existingParent.name;
    existingParent.categoryId = input.updateProductInput.categoryId !== undefined ? input.updateProductInput.categoryId : existingParent.categoryId;
    existingParent.brandId = input.updateProductInput.brandId !== undefined ? input.updateProductInput.brandId : existingParent.brandId;
    existingParent.uomId = input.updateProductInput.uomId !== undefined ? input.updateProductInput.uomId : existingParent.uomId;
    
    await existingParent.save()

    await existingProduct.save();

    const compressedResponse = this.compressionService.compressData(existingProduct);

    return compressedResponse;
    
  }
  
  @MessagePattern({ cmd: 'pagination_temp_product' })
  async pagination_temp_product(@Payload() data: any, @Ctx() context: any)  {
    
    const input = this.decompressionService.decompressData(data.data);
    let  [result, total]  =  await ProductTemporary.findAndCount({
        take: input.take,
        skip: input.skip,
        where : {
          deletedAt: IsNull(),
          status: ThreeStateSupervisionStatuses.PENDING
        }
    });
    const compressedResponse = this.compressionService.compressData([result,total]);

    return compressedResponse;
  }
  
  @MessagePattern({ cmd: 'search_products' })
  async search_product(@Payload() data: any, @Ctx() context: any)  {

    const input = (this.decompressionService.decompressData(data.data));

    const whereConditions: any = {};
  
    if (input.query.query) {
      whereConditions[`name`] = Like(`%${input.query.query}%`);
    }

    let  result  =  await Products.find({
      take:ShortResponse.SHORT,
      where: whereConditions,
      });
 

    const compressedResponse = this.compressionService.compressData(result);


    return compressedResponse;
  }

  @MessagePattern({ cmd: 'similar_product' })
  async getSimilarProduct(@Payload() data: any, @Ctx() context: any)  {

    const indexProductInput = this.decompressionService.decompressData(data.data);

    const product = await Products.findOne({
      where: { id: indexProductInput.id },
      select: {
        parent: {
          categoryId: true
        }
      }

    });

    if (!product) {
        throw new Error("Product not found");
    }

    const categoryId = product.parent?.categoryId;

    const relatedProducts = await Products.find({
        where: {
            parent: {
                categoryId: categoryId
            },
            id: Not(indexProductInput.id)
        },
        take: 5 ,
        order : {
          rating : 'DESC'
        }
    });

    const compressedResponse = this.compressionService.compressData(relatedProducts);

    return compressedResponse;
  }
  
  @MessagePattern({ cmd: 'getParentFromIds' })
  async getParentFromIds(@Payload() data: any, @Ctx() context: any) {
    const productIds: number[] = data.productParentIds;

    const productIdString = productIds.join(',');

    const query = `
        SELECT 
        pp.id,
        pp.name,
        pb.name AS brandName,
        btc.title AS categoryTitle,
        uo.name AS uomName
        FROM 
            parent_product AS pp
        JOIN 
            product_brands pb ON pp."brandId" = pb.id
        JOIN 
            base_taxonomy_categories btc  ON pp."categoryId" = btc.id
        JOIN 
            product_uom  uo ON pp."uomId"  = uo.id
        WHERE pp."id" = ANY(array[${productIdString}])
    `
    
    const response =  await this.dataSource.query(query);


    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;
  }
  @MessagePattern({ cmd: 'find_one_product' })
  async findOne(@Payload() data: any, @Ctx() context: any) {
    const indexProductInput = this.decompressionService.decompressData(data.data);
    const id = indexProductInput.id;
    const product: Products = await  Products.findOne({
      where: {
          id: id,
      },
      // relations:['parent.brand','parent.category','parent.uom']
    });
    if (!product) {
      throw new NotFoundException();
    }
    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'find_one_temp' })
  async find_one_temp(@Payload() data: any, @Ctx() context: any) {
    const indexProductInput = this.decompressionService.decompressData(data.data);
    const id = indexProductInput.id;
    const product: ProductTemporary = await  ProductTemporary.findOne({
      where: {
          id: id,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'remove_temp' })
  async remove_temp(@Payload() data: any, @Ctx() context: any) {
    const indexProductInput = this.decompressionService.decompressData(data.data);
    const id = indexProductInput.id;
    const product: ProductTemporary = await  ProductTemporary.findOne({
      where: {
          id: id,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    product.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})
    await product.save()
    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
  }



  @MessagePattern({ cmd: 'find_one_product_attribute' })
  async findOneAttribuites(@Payload() data: any, @Ctx() context: any) {
    const indexProductInput = this.decompressionService.decompressData(data.data);
    const id = indexProductInput.id;
    const attribuites: AttributeValueProduct[] = await  AttributeValueProduct.find({
      where: {
        productId:id
      },
    });
    const compressedResponse = this.compressionService.compressData(attribuites);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'find_products_by_ids' })
  async findByIds(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);

    const product: Products[] = await  Products.findBy({
      id: In(input.ids),
      deletedAt: IsNull()
    });
    if (!product) {
      throw new NotFoundException();
    }
    const compressedResponse = this.compressionService.compressData(product);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'add_temporary_product' })
  async add_temporary_product(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);

    const temp = new ProductTemporary();

    temp.name        = input.createProductTemporaryInput.name;
    temp.description = input.createProductTemporaryInput.description;
    temp.category    = input.createProductTemporaryInput.category;
    temp.brand       = input.createProductTemporaryInput.brand;
    temp.length      = input.createProductTemporaryInput.length;
    temp.width       = input.createProductTemporaryInput.width;
    temp.height      = input.createProductTemporaryInput.height;
    temp.weight      = input.createProductTemporaryInput.weight;
    temp.sellerId    = input.sellerId;
    temp.userId      = input.userId;
    await temp.save();


    const compressedResponse = this.compressionService.compressData(temp);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'add_temporary_product_file' })
  async add_temporary_product_file(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);

    const temp = new ProductFileTemporary();

    temp.file_id         = input.createProductTemporaryInput.file_id;
    temp.product_temp_id = input.createProductTemporaryInput.product_temp_id;
   
    await temp.save();


    const compressedResponse = this.compressionService.compressData(temp);

    return compressedResponse;
  }
  
  @MessagePattern({ cmd: 'add_temporary_product_attribuite' })
  async add_temporary_product_attribuite(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);

    const temp = new ProductAttribuiteTemporary();

    temp.attribuite         = input.createProductTemporaryAttribuiteInput.attribuite;
    temp.value              = input.createProductTemporaryAttribuiteInput.value;
    temp.product_temp_id    = input.createProductTemporaryAttribuiteInput.product_temp_id;
    
    await temp.save();


    const compressedResponse = this.compressionService.compressData(temp);

    return compressedResponse;
  }


  @MessagePattern({ cmd: 'remove_product' })
  async remove(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.id;
    const parent = await Products.findOneBy({ id: id });
    if (!parent) {
      throw new NotFoundException();
    }
    parent.deletedAt = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"})
    await parent.save()
    return true;
  }
}
