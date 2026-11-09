import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

@Injectable()
export class AuthService {
  private get secret(): string {
    return process.env.ADMIN_SECRET ?? 'dev-only-change-me';
  }

  private get password(): string {
    return process.env.ADMIN_PASSWORD ?? 'admin1234';
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('base64url');
  }

  login(password: unknown): { token: string; expiresAt: string } {
    if (
      typeof password !== 'string' ||
      !timingSafeEqual(sha256(password), sha256(this.password))
    ) {
      throw new UnauthorizedException('Wrong password');
    }
    const exp = Date.now() + TOKEN_TTL_MS;
    const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
    return {
      token: `${payload}.${this.sign(payload)}`,
      expiresAt: new Date(exp).toISOString(),
    };
  }

  verify(token: string | undefined): boolean {
    if (!token) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return false;
    const expected = Buffer.from(this.sign(payload));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
      return false;
    }
    try {
      const { exp } = JSON.parse(
        Buffer.from(payload, 'base64url').toString('utf8'),
      ) as { exp?: unknown };
      return typeof exp === 'number' && exp > Date.now();
    } catch {
      return false;
    }
  }
}
