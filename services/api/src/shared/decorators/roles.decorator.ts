import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../core/domain/entities/user.entity';

/**
 * Decorator de roles - Define permissões por endpoint
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
