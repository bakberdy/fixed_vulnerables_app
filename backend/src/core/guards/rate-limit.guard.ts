import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, RateLimitRecord>();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const identifier = this.getIdentifier(request);

    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (record) {
      if (now > record.resetTime) {
        this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
        return true;
      }

      if (record.count >= this.maxAttempts) {
        const remainingTime = Math.ceil((record.resetTime - now) / 1000 / 60);
        throw new HttpException(
          `Too many login attempts. Please try again in ${remainingTime} minutes.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      record.count++;
      return true;
    }

    this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
    return true;
  }

  private getIdentifier(request: Request): string {
    const ip = request.ip || request.socket.remoteAddress || 'unknown';
    const email = request.body?.email || '';
    return `${ip}:${email}`;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}
