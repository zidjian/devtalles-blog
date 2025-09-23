import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord-auth';
import { PrismaService } from '../../prisma/prisma.service';
import { envs } from '../../config/envs';

interface DiscordProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(private prisma: PrismaService) {
    super({
      clientId: envs.discordClientId,
      clientSecret: envs.discordClientSecret,
      callbackUrl: envs.discordCallbackUrl,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: DiscordProfile,
  ) {
    const { id, username, email, avatar } = profile;

    // Buscar usuario existente por Discord ID
    let user = await this.prisma.user.findUnique({
      where: { discordId: id },
    });

    if (user) {
      // Actualizar información si es necesario
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          discordUsername: username,
          discordAvatar: avatar,
          email: email || user.email,
        },
      });
    } else {
      // Buscar usuario existente por email
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email || '' },
      });

      if (existingUser) {
        // Vincular cuenta Discord a usuario existente
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            discordId: id,
            discordUsername: username,
            discordAvatar: avatar,
          },
        });
      } else {
        // Crear nuevo usuario
        user = await this.prisma.user.create({
          data: {
            discordId: id,
            discordUsername: username,
            discordAvatar: avatar,
            email: email || '',
            username: username,
            firstName: username,
            lastName: '',
            profilePicture: avatar,
          },
        });
      }
    }

    return user;
  }
}
