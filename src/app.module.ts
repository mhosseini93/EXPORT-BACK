import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HomeModule } from './home/home.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
