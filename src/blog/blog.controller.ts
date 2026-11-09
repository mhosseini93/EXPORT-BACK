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
import { BlogService } from './blog.service.js';

@Controller('blog')
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  /* ---------- Public ---------- */

  @Get('settings')
  settings() {
    return this.blog.settings();
  }

  @Get('categories')
  categories() {
    return this.blog.categories();
  }

  @Get('categories/:slug')
  category(@Param('slug') slug: string) {
    return this.blog.categoryBySlug(slug);
  }

  /** Live posts only (published, not scheduled), without bodies. */
  @Get('posts')
  posts() {
    return this.blog.livePosts();
  }

  @Get('posts/:slug')
  post(@Param('slug') slug: string) {
    return this.blog.livePostBySlug(slug);
  }

  /* ---------- Admin ---------- */

  @Put('settings')
  @UseGuards(AdminGuard)
  updateSettings(@Body() body: unknown) {
    return this.blog.updateSettings(body);
  }

  @Post('categories')
  @UseGuards(AdminGuard)
  createCategory(@Body() body: unknown) {
    return this.blog.createCategory(body);
  }

  // Declared before ":id" so "order" is not parsed as an id.
  @Put('categories/order')
  @UseGuards(AdminGuard)
  reorderCategories(@Body() body: unknown) {
    return this.blog.reorderCategories(body);
  }

  @Put('categories/:id')
  @UseGuards(AdminGuard)
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.blog.updateCategory(id, body);
  }

  @Delete('categories/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.blog.deleteCategory(id);
  }

  @Get('admin/posts')
  @UseGuards(AdminGuard)
  allPosts() {
    return this.blog.allPosts();
  }

  @Get('admin/posts/:id')
  @UseGuards(AdminGuard)
  postById(@Param('id', ParseIntPipe) id: number) {
    return this.blog.postById(id);
  }

  @Post('posts')
  @UseGuards(AdminGuard)
  createPost(@Body() body: unknown) {
    return this.blog.createPost(body);
  }

  @Put('posts/:id')
  @UseGuards(AdminGuard)
  updatePost(@Param('id', ParseIntPipe) id: number, @Body() body: unknown) {
    return this.blog.updatePost(id, body);
  }

  @Delete('posts/:id')
  @UseGuards(AdminGuard)
  @HttpCode(204)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.blog.deletePost(id);
  }
}
