import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../core/domain/entities/user.entity';

/**
 * Decorator para injetar usuário autenticado
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
