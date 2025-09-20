import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { username: registerDto.username }],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or username already exists',
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      },
    });

    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async refreshToken(userId: number): Promise<AuthResponse> {
    // Buscar el usuario por ID
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Crear nuevo payload con la información actualizada del usuario
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // Generar nuevo token
    const newToken = this.jwtService.sign(payload);

    return {
      access_token: newToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
      },
    };
  }
}
