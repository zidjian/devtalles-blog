import { Role } from '@prisma/client';

export interface JwtPayload {
  email: string;
  sub: number;
  username: string;
  role: Role;
}
