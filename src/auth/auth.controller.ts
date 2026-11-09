import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from './admin.guard.js';
import { AuthService } from './auth.service.js';

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

@Controller('auth')
export class AuthController {
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() body: { password?: unknown } | undefined, @Ip() ip: string) {
    const now = Date.now();
    const recent = (this.attempts.get(ip) ?? []).filter(
      (t) => now - t < WINDOW_MS,
    );
    if (recent.length >= MAX_ATTEMPTS) {
      throw new HttpException(
        'Too many attempts. Try again in a minute.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.attempts.set(ip, recent);
    const result = this.auth.login(body?.password);
    this.attempts.delete(ip);
    return result;
  }

  @Get('me')
  @UseGuards(AdminGuard)
  me() {
    return { ok: true };
  }
}
