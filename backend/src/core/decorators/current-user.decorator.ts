import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return {
      id: request.session?.userId,
      email: request.session?.userEmail,
      role: request.session?.userRole,
    };
  },
);
