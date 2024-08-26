// rabbitmq.module.ts

import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';

@Module({
  imports: [

  ],
  controllers: [ParentController],
})
export class ParentModules {}
