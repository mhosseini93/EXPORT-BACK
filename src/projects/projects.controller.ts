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
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  // Static routes are declared before ":slug" / ":id" so they are not parsed as params.

  @Get('settings')
  settings() {
    return this.projects.settings();
  }

  @Put('settings')
  @UseGuards(AdminGuard)
  updateSettings(@Body() body: unknown) {
    return this.projects.updateSettings(body);
  }

  @Get('admin/all')
  @UseGuards(AdminGuard)
  all() {
    return this.projects.all();
  }

  @Get('admin/:id')
  @UseGuards(AdminGuard)
  byId(@Param('id', ParseIntPipe) id: number) {
    return this.projects.byId(id);
  }

  @Put('order')
  @UseGuards(AdminGuard)
  reorder(@Body() body: unknown) {
    return this.projects.reorder(body);
  }

  /** Published projects in display order. */
  @Get()
  published() {
    return this.projects.published();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.projects.publishedBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: unknown) {
    return this.projects.create(body);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.projects.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projects.remove(id);
  }
}
