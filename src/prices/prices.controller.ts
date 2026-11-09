import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { PricesService } from './prices.service.js';

@Controller('prices')
export class PricesController {
  constructor(private readonly prices: PricesService) {}

  @Get()
  list() {
    return this.prices.list();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.prices.bySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: unknown) {
    return this.prices.create(body);
  }

  // Declared before ":id" so "order" is not parsed as an id.
  @Put('order')
  @UseGuards(AdminGuard)
  reorder(@Body() body: unknown) {
    return this.prices.reorder(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.prices.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prices.remove(id);
  }
}
