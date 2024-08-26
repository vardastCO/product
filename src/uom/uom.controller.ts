// rabbitmq.controller.ts

import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { PaginationUOMResponse } from './dto/pagination-uom.response';
import { Uom } from './entities/uom.entity';
import { DecompressionService } from 'src/decompression.service';
import { CompressionService } from 'src/compression.service';

@Controller()
export class UomController {
  constructor(private readonly compressionService: CompressionService,
    private readonly decompressionService: DecompressionService 
    ) {}

  @MessagePattern({ cmd: 'pagination_uoms' })
  async getPaginationUom(@Payload() data: any, @Ctx() context: any)  {

    const indexUomInput = this.decompressionService.decompressData(data.data);

    const [result, total] = await Uom.findAndCount({
      take:indexUomInput.indexUomInput.take,
      skip:indexUomInput.indexUomInput.skip,
    });

    const response = PaginationUOMResponse.make(indexUomInput.indexUomInput, total, result);

    const compressedResponse = this.compressionService.compressData(response);

    return compressedResponse;
  }
  @MessagePattern({ cmd: 'update_uom' })
  async update_uom(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data);
    const id = input.updateUomInput.id;
    const UOM: Uom = await Uom.findOneBy({ id: id });
    if (!UOM) {
      throw new NotFoundException();
    }
    Object.assign(UOM, input.updateUomInput);

    await UOM.save();
    const compressedResponse = this.compressionService.compressData(UOM);

    return compressedResponse;
  }

  @MessagePattern({ cmd: 'find_one_uom' })
  async findOne(@Payload() data: any, @Ctx() context: any) {
    const id = data.data.id;

    const uom: Uom = await Uom.findOneBy({ id: id});
    if (!uom) {
      throw new NotFoundException();
    }


    const compressedResponse = this.compressionService.compressData(uom);

    return compressedResponse;

  }

  @MessagePattern({ cmd: 'create_uom' })
  async create_uom(@Payload() data: any, @Ctx() context: any) {
    const input = this.decompressionService.decompressData(data.data).createUomInput;
    const uom = new Uom();
    uom.name = input.name;
    uom.symbol = input.symbol; 
    uom.isActive = input.isActive; 
    await uom.save();
    const compressedResponse = this.compressionService.compressData(uom);

    return compressedResponse;

  }
  @MessagePattern({ cmd: 'remove_uom' })
  async remove(@Payload() data: any, @Ctx() context: any) {
    const id = data.id;
    const uom = await Uom.findOneBy({ id: id });
    if (!uom) {
      throw new NotFoundException();
    }
    await uom.remove();
   
    return JSON.stringify(uom);
  }
}
