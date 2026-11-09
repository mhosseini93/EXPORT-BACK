import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PricesController } from './prices.controller.js';
import { PricesService } from './prices.service.js';

@Module({
  imports: [AuthModule],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
