import { Observable } from 'rxjs';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IAuthRequest } from '@/auth/types/auth-request';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const user = context.switchToHttp().getRequest<IAuthRequest>().user;

    return this.mathRoles(user.role, roles);
  }

  private mathRoles(userRole: string, roles: string[]): boolean {
    return roles.some((role) => userRole.includes(role));
  }
}
