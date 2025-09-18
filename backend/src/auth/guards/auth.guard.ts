import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected/role-protected.decorator';
import { User } from '@prisma/client';
import { ValidRoles } from '../interfaces/valid-role';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obtener roles del método
    const validRolesMethod = this.reflector.get<ValidRoles[]>(
      META_ROLES,
      context.getHandler(),
    );

    // Obtener roles de la clase
    const validRolesClass = this.reflector.get<ValidRoles[]>(
      META_ROLES,
      context.getClass(),
    );

    // Combinar roles de clase y método
    const validRoles = [
      ...(validRolesMethod || []),
      ...(validRolesClass || []),
    ];

    if (!validRoles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user)
      throw new UnauthorizedException('Invalid token - user not found');

    if (validRoles.includes(user.role as ValidRoles)) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.email} needs a valid role: ${validRoles}`,
    );
  }
}
