// rabbitmq.controller.ts

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Controller()
export class RabbitMQController {
  constructor(private readonly entityManager: EntityManager) {}

  @MessagePattern({ cmd: 'product_queue' })
  async getDate(@Payload() data: any, @Ctx() context: any) {
    const products: any = [];

    for (let i = 0; i < 10; i++) {
      const product: any = {
        id: i + 1, 
        name: `Product ${i + 1}`,
        sku: Math.floor(Math.random() * 1000).toString(), 
      };
  
      products.push(product);
    }
  
    return JSON.stringify(products);
  }
}
