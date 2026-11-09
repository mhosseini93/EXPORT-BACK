import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { BlogModule } from './blog/blog.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HomeModule } from './home/home.module.js';
import { PricesModule } from './prices/prices.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, HomeModule, PricesModule, BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
