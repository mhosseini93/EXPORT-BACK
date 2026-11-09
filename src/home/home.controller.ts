import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { HomeService } from './home.service.js';

@Controller('home')
export class HomeController {
  constructor(private readonly home: HomeService) {}

  @Get()
  get() {
    return this.home.get();
  }

  @Put()
  @UseGuards(AdminGuard)
  update(@Body() body: unknown) {
    return this.home.update(body);
  }
}
