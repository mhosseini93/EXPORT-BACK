import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { HomeController } from './home.controller.js';
import { HomeService } from './home.service.js';

@Module({
  imports: [AuthModule],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
